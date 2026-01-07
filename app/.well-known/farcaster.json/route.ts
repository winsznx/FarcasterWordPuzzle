import { minikitConfig } from '../../../minikit.config';

export async function GET() {
    // Official Farcaster Mini App spec
    // See: https://miniapps.farcaster.xyz/docs/guides/publishing
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation,
        miniapp: {
            version: minikitConfig.miniapp.version,
            name: minikitConfig.miniapp.name,
            iconUrl: minikitConfig.miniapp.iconUrl,
            homeUrl: minikitConfig.miniapp.homeUrl,
            imageUrl: minikitConfig.miniapp.imageUrl,
            buttonTitle: minikitConfig.miniapp.buttonTitle,
            splashImageUrl: minikitConfig.miniapp.splashImageUrl,
            splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
        },
    };

    return Response.json(manifest);
}
