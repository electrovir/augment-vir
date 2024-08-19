export async function main() {
    console.error('started');
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.error('ended');
            resolve();
        }, 1000);
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
