const Artwork = artifacts.require('Artwork');

let instance;

beforeEach(async () => {
    instance = await Artwork.new();
});

contract('Artwork', accounts => {

    it('should have available artworks', async () => {
        let totalArtworks = await instance.totalArtworks();

        assert(totalArtworks > 0)
    });

    it('should create a new artwork', async () => {
        await instance.addArtwork('Mona Lisa', 'Leonardo', 'httos://', 1769, 2, { from: accounts[1] });

        let myTotalArtworks = await instance.myTotalArtworks({ from: accounts[1] });

        assert(myTotalArtworks > 0);
    });

    it('should create artworks with different accounts', async () => {
        await instance.addArtwork('Mona Lisa', 'Leonardo', 'httos://', 1769, 2, { from: accounts[1] });
        await instance.addArtwork('Perro Poker', 'Eo Deovini', 'httos://', 1669, 2, { from: accounts[1] });
        await instance.addArtwork('Guernica', 'Da Vincei', 'httos://', 1833, 3, { from: accounts[1] });
        await instance.addArtwork('Guernica 2.0', 'Da Vincei', 'httos://', 1839, 3, { from: accounts[2] });

        let myTotalArtworks1 = await instance.myTotalArtworks({ from: accounts[1] });
        let myTotalArtworks2 = await instance.myTotalArtworks({ from: accounts[2] });
        let totalArtworks = await instance.totalArtworks();

        assert.equal(myTotalArtworks1.toNumber(), 3);
        assert.equal(myTotalArtworks2.toNumber(), 1);
        assert.equal(totalArtworks.toNumber(), 7);
    })

    it('should let client buy an artwork', async () => {
        let artwork = await instance.artworks(0);
        let artworkTitle = artwork[0], artworkPrice = artwork[4];

        await instance.buyArtwork(0, { from: accounts[1], value: artworkPrice });

        let clientArtwork = await instance.clientArtworks(accounts[1], 0);
        let clientTotalArtworks = await instance.myTotalArtworks({ from: accounts[1] });

        assert(clientArtwork[0], artworkTitle);
        assert.equal(clientArtwork[4].toNumber(), artworkPrice.toNumber());
        assert.equal(clientTotalArtworks.toNumber(), 1);

    })

    it('should let client delete an artwork', async () => {
        let artwork = await instance.artworks(0);
        let artworkOwner = artwork[5], artworkHashCode = artwork[6];

        await instance.deleteArtwork(0, artworkHashCode, artworkOwner, { from: accounts[0] });

        let artworkDeleted = await instance.artworks(0);

        let artworkPrice = artworkDeleted[4]

        assert.equal(artworkPrice, 0);
    })

    it('should let client edit an artwork', async () => {
        let artwork = await instance.artworks(0);
        let artworkTitle = artwork[0], artworkAuthor = artwork[1], artworkIpfsHash = artwork[2], artworkProductionYear = artwork[3], artworkOwner = artwork[5], artworkHashCode = artwork[6];
        let newPrice = 5;

        await instance.editArtwork(0, artworkHashCode, artworkOwner, artworkTitle, artworkAuthor, artworkIpfsHash, artworkProductionYear, newPrice, { from: accounts[0] });

        let artworkEdited = await instance.artworks(0);
        let artworkEditedClient = await instance.clientArtworks(accounts[0], 0);

        let artworkNewPrice = artworkEdited[4];
        let artworkNewPriceClient = artworkEditedClient[4];

        assert.equal(artworkNewPrice.toNumber(), newPrice);
        assert.equal(artworkNewPriceClient.toNumber(), newPrice);
    })

})