// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Articulo {
    string public titulo;
    string[] public contenido;

    constructor(string memory _titulo, string[] memory _contenido) {
        titulo = _titulo;
        contenido = _contenido;
    }

    function setTitulo(string memory _titulo) public {
        titulo = _titulo;
    }

    function setContenido(string[] memory _contenido) public {
        contenido = _contenido;
    }

    function addContenido(string memory _version) public {
        contenido.push(_version);
    }

    function getContenido() public view returns (string[] memory) {
        return contenido;
    }
}
