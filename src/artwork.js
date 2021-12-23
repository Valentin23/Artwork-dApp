import ArtworkContract from "../build/contracts/Artwork.json";
import contract from "truffle-contract";

export default async(provider) => {
    const artwork = contract(ArtworkContract);
    artwork.setProvider(provider);

    let instance = await artwork.deployed();

    return instance;
}