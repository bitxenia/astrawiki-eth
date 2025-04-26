// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Articulo.sol";

contract ArticuloFactory {
    address[] public articulos;
    string[] public titulos;
    mapping(string => address) public tituloToAddress;

    function crearArticulo(
        string memory titulo,
        string[] memory contenido
    ) public {
        require(tituloToAddress[titulo] == address(0), "Article already exists");
        address newArticulo = address(new Articulo(titulo, contenido));
        tituloToAddress[titulo] = newArticulo;
        articulos.push(newArticulo);
        titulos.push(titulo);
    }

    function getArticulos() public view returns (address[] memory) {
        return articulos;
    }

    function getTitulos() public view returns (string[] memory) {
        return titulos;
    }
}
