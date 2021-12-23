export class ArtworkService {
    constructor(contract) {
        this.contract = contract;
    }

    async buyArtwork(artworkIndex, from, value) {
        return this.contract.buyArtwork(artworkIndex, { from, value });
    }

    async getArtworks() {
        let total = await this.getTotalArtworks();
        let artworks = [];

        for (let i = 0; i < total; i++) {
            let artwork = await this.contract.artworks(i);

            artworks.push(artwork);
        }

        return this.mapArtworks(artworks);
    }

    async getClientArtworks(account) {
        let clientTotalArtworks = await this.contract.myTotalArtworks({ from: account });
        let clientArtworks = [];

        for (let i = 0; i < clientTotalArtworks.toNumber(); i++) {
            let artwork = await this.contract.clientArtworks(account, i);

            clientArtworks.push(artwork);
        }

        return this.mapArtworks(clientArtworks);
    }

    async addArtwork(title, author, ipfsHash, productionYear, price, account) {
        return this.contract.addArtwork(title, author, ipfsHash, productionYear, price, { from: account });
    }

    async editArtwork(artworkIndex, hashCode, owner, title, author, ipfsHash, productionYear, price, account) {
        return this.contract.editArtwork(artworkIndex, hashCode, owner, title, author, ipfsHash, productionYear, price, { from: account });
    }

    async deleteArtwork(artworkIndex, hashCode, artworkOwner, account) {
        return this.contract.deleteArtwork(artworkIndex, hashCode, artworkOwner, { from: account });
    }

    async getTotalArtworks() {
        return (await this.contract.totalArtworks()).toNumber();
    }

    async getMyTotalArtworks(account) {
        return (await this.contract.myTotalArtworks({ from: account })).toNumber();
    }

    mapArtworks(artworks) {
        return artworks.map(artwork => {
            return {
                title: artwork[0],
                author: artwork[1],
                ipfsHash: artwork[2],
                productionYear: artwork[3].toNumber(),
                price: artwork[4].toNumber(),
                owner: artwork[5],
                hashCode: artwork[6]
            }
        });
    }
}