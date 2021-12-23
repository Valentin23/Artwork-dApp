import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import ArtworkContract from "./artwork";
import { ArtworkService } from "./artworkService";
import ipfs from "./ipfs";

const converterfromWei = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

const converterToWei = (web3) => {
    return (value) => {
        return web3.utils.toWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            balance: 0,
            account: undefined,
            artworks: [],
            clientArtworks: [],
            buffer: undefined,
            ipfsHash: 'QmdRH5JT6yX7ZGo82ygYkiTXi4yLkaQ9RrQYDmH6JKJMLq',
            artworkEdit: undefined,
            artworkEditIndex: 0
        }

        this.captureFile = this.captureFile.bind(this);

    }

    async componentDidMount() {
        this.web3 = await getWeb3();
        this.toEther = converterfromWei(this.web3);
        this.toWei = converterToWei(this.web3);
        this.artwork = await ArtworkContract(this.web3.currentProvider);
        this.artworkService = new ArtworkService(this.artwork);

        var account = (await this.web3.eth.getAccounts())[0];

        this.web3.currentProvider.on('accountsChanged', async function (event) {
            this.setState({
                account: event[0].toLowerCase()
            }, () => {
                this.load();
            });
        }.bind(this));

        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        })
    }

    async getBalance() {
        let weiBalance = await this.web3.eth.getBalance(this.state.account);

        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    async buyArtwork(artworkIndex, artwork) {
        await this.artworkService.buyArtwork(artworkIndex, this.state.account, artwork.price);

        this.load();
    }

    async getArtworks() {
        let artworks = await this.artworkService.getArtworks();

        this.setState({
            artworks
        });
    }

    async getClientArtworks() {
        let clientArtworks = await this.artworkService.getClientArtworks(this.state.account);

        this.setState({
            clientArtworks
        });
    }

    async addArtwork() {
        let form = document.getElementById('formNewArtwork');

        let title = form.elements['title'].value;
        let author = form.elements['author'].value;
        let productionYear = form.elements['year'].value;
        let price = this.toWei(form.elements['price'].value);

        await this.artworkService.addArtwork(
            title,
            author,
            this.state.ipfsHash,
            productionYear,
            price,
            this.state.account);

        document.getElementById('closeCreateModal').click();
        form.reset();

        this.setState({ ipfsHash: 'QmdRH5JT6yX7ZGo82ygYkiTXi4yLkaQ9RrQYDmH6JKJMLq' });

        this.load();
    }

    setModalForArtworkEdit(artworkIndex, artwork) {
        let form = document.getElementById('formEditArtwork');

        form.elements['title'].value = artwork.title;
        form.elements['author'].value = artwork.author;
        form.elements['year'].value = artwork.productionYear;
        form.elements['price'].value = this.toEther(artwork.price);

        this.setState({
            ipfsHash: artwork.ipfsHash,
            artworkEdit: artwork,
            artworkEditIndex: artworkIndex
        });
    }

    async editArtwork() {
        let form = document.getElementById('formEditArtwork');

        let title = form.elements['title'].value;
        let author = form.elements['author'].value;
        let productionYear = form.elements['year'].value;
        let price = this.toWei(form.elements['price'].value);

        await this.artworkService.editArtwork(
            this.state.artworkEditIndex,
            this.state.artworkEdit.hashCode,
            this.state.artworkEdit.owner,
            title,
            author,
            this.state.ipfsHash,
            productionYear,
            price,
            this.state.account);

        document.getElementById('closeEditModal').click();
        form.reset();

        this.setState({
            ipfsHash: 'QmdRH5JT6yX7ZGo82ygYkiTXi4yLkaQ9RrQYDmH6JKJMLq',
            artworkEdit: undefined,
            artworkEditIndex: 0
        });

        this.load();
    }

    async deleteArtwork(artworkIndex, hashCode, artworkOwner) {
        await this.artworkService.deleteArtwork(artworkIndex, hashCode, artworkOwner, this.state.account);

        this.load();
    }

    captureFile(event) {

        const file = event.target.files[0];
        const reader = new window.FileReader();

        reader.readAsArrayBuffer(file);

        reader.onloadend = () => {
            this.setState({
                buffer: Buffer(reader.result) // format to post to IPFS
            });

            ipfs.files.add(this.state.buffer, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }

                this.setState({
                    ipfsHash: res[0].hash
                });
            });
        }

        var fileName = event.target.files[0].name;

        document.getElementsByClassName("custom-file-label")[0].classList.add("selected");
        document.getElementsByClassName("custom-file-label")[0].innerHTML = fileName;
    }

    async load() {
        this.getBalance();
        this.getArtworks();
        this.getClientArtworks();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Artwork Gallery!</h4>
            </div>
            <div className="row first-row">
                <button type="button" className="btn btn-success ml-0" data-toggle="modal" data-target="#createArtworkModal">
                    New artwork
                </button>
                <div className="modal fade" id="createArtworkModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form id="formNewArtwork">
                                <div className="modal-header">
                                    <h4 className="modal-title">Add new artwork</h4>
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>

                                <div className="modal-body">

                                    <div className="form-group d-flex justify-content-center">
                                        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" className="newImage" />
                                    </div>

                                    <div className="custom-file mb-3">
                                        <input type="file" className="custom-file-input" id="customFile" onChange={this.captureFile}></input>
                                        <label className="custom-file-label" htmlFor="customFile" style={{ marginLeft: 3 + 'px' }}>Choose file</label>
                                    </div>
                                    <div className="form-group"><label>Title:</label><input type="text" name="title" className="form-control" placeholder="Title" required></input></div>
                                    <div className="form-group"><label>Author:</label><input type="text" name="author" className="form-control" placeholder="Author" required></input></div>
                                    <div className="form-group"><label>Production year:</label><input type="number" name="year" className="form-control" placeholder="Production year" required></input></div>
                                    <div className="form-group"><label>Price:</label><input type="number" name="price" className="form-control" placeholder="Price(Ether)" required></input></div>

                                    <div className="d-flex justify-content-center">
                                        <button type="button" className="btn btn-light" id="closeCreateModal" data-dismiss="modal">Close</button>
                                        <button href="#"
                                            type="button"
                                            className="btn btn-success text-white"
                                            onClick={() => this.addArtwork()}>Add artwork</button>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p><strong>{this.state.account}</strong></p>
                        <span><strong>Balance</strong>: {this.state.balance}</span>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available artworks">
                        {this.state.artworks.map((artwork, i) => {
                            if (artwork.owner != this.state.account && artwork.title !== "") {
                                return <div key={i} className="container">
                                    <img src={`https://ipfs.io/ipfs/${artwork.ipfsHash}`} alt={artwork.title} className="image" />
                                    <div className="middle">
                                        <p><strong>Title</strong>: {artwork.title}</p>
                                        <p><strong>Author</strong>: {artwork.author}</p>
                                        <p><strong>Year</strong>: {artwork.productionYear}</p>
                                        <p><strong>Price</strong>: {this.toEther(artwork.price)} Ether</p>

                                        <button className="btn btn-sm btn-success text-white"
                                            onClick={() => this.buyArtwork(i, artwork)} >
                                            Purchase
                                        </button>
                                    </div>
                                </div>
                            }
                        })}


                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="My artworks">
                        {this.state.clientArtworks.map((artwork, i) => {
                            if (artwork.title !== "") {
                                return <div key={i} className="container">
                                    <img src={`https://ipfs.io/ipfs/${artwork.ipfsHash}`} alt={artwork.title} className="image" />
                                    <div className="middle">
                                        <p><strong>Title</strong>: {artwork.title}</p>
                                        <p><strong>Author</strong>: {artwork.author}</p>
                                        <p><strong>Year</strong>: {artwork.productionYear}</p>
                                        <p><strong>Price</strong>: {this.toEther(artwork.price)} Ether</p>

                                        <button type="button" className="btn btn-sm btn-primary" data-toggle="modal" data-target="#editArtworkModal"
                                            onClick={() => this.setModalForArtworkEdit(i, artwork)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-warning text-white"
                                            onClick={() => this.deleteArtwork(i, artwork.hashCode, artwork.owner)} >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            }
                        })}
                    </Panel>
                </div>
            </div>

            <div className="modal fade" id="editArtworkModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form id="formEditArtwork">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit artwork</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div className="modal-body">

                                <div className="form-group d-flex justify-content-center">
                                    <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" className="newImage" />
                                </div>

                                <div className="custom-file mb-3">
                                    <input type="file" className="custom-file-input" id="customFile" onChange={this.captureFile}></input>
                                    <label className="custom-file-label" htmlFor="customFile" style={{ marginLeft: 3 + 'px' }}>Choose file</label>
                                </div>
                                <div className="form-group"><label>Title:</label><input type="text" name="title" className="form-control" placeholder="Title" required></input></div>
                                <div className="form-group"><label>Author:</label><input type="text" name="author" className="form-control" placeholder="Author" required></input></div>
                                <div className="form-group"><label>Production year:</label><input type="number" name="year" className="form-control" placeholder="Production year" required></input></div>
                                <div className="form-group"><label>Price:</label><input type="number" name="price" className="form-control" placeholder="Price(in Ether)" required></input></div>

                                <div className="d-flex justify-content-center">
                                    <button type="button" className="btn btn-light" id="closeEditModal" data-dismiss="modal">Cancel</button>
                                    <button href="#"
                                        type="button"
                                        className="btn btn-success text-white"
                                        onClick={() => this.editArtwork()}>Save</button>
                                </div>

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}