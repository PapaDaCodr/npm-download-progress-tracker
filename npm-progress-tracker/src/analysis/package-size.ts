import https from 'https';

interface PackageSize {
    name: string;
    size: number;
    dependencies: { [key: string]: number };
}

function httpsGet(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(JSON.parse(data)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

export async function analyzePackageSize(packageName: string): Promise<PackageSize> {
    try {
        const packageInfo = await httpsGet(`https://registry.npmjs.org/${packageName}/latest`);
        const dependencies = packageInfo.dependencies || {};
        const depSizes: { [key: string]: number } = {};
        
        for (const dep of Object.keys(dependencies)) {
            try {
                const depInfo = await httpsGet(`https://registry.npmjs.org/${dep}/latest`);
                depSizes[dep] = depInfo.dist?.unpackedSize || 0;
            } catch (error) {
                console.error(`Failed to fetch size for dependency ${dep}`);
                depSizes[dep] = 0;
            }
        }
        
        return {
            name: packageName,
            size: packageInfo.dist?.unpackedSize || 0,
            dependencies: depSizes
        };
    } catch (error) {
        console.error(`Failed to analyze package size for ${packageName}`);
        return {
            name: packageName,
            size: 0,
            dependencies: {}
        };
    }
}