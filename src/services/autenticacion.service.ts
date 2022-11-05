import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Cliente} from '../models';
import {ClienteRepository} from '../repositories';


const generador = require("password-generator");
const cryptoJS = require("crypto-js");//importamos el paquete de crypto-js
const jwt = require("jsonwebtoken");//importamos el paquete de jwt
@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
@repository(ClienteRepository)
public clienteRepository:ClienteRepository
  ) {}
  /*
   * Add service methods here
   */

  GenerarClave(){
    let password = generador(8, false);//asignamos el valor de la clave //longitud
    return password;
  }

  CifrarClave(password : string){
    let passwordCifrada = cryptoJS.MD5(password).toString();
    return passwordCifrada;
  }

  IdentificarCliente(usuario: string, password: string){
    try {
      let p =  this.clienteRepository.findOne({where: {correo: usuario, password: password}})
      if(p){
        return p;
      }
      return false;
    } catch{
      return false;
    }
  }

    GenerarTokenJWT(cliente: Cliente){
      let token = jwt.sign({
        data: {
         id: cliente.id,
         correo: cliente.correo,
         nombre: cliente.nombre + cliente.apellidos,
        },
        //la firma de un token debe hacerse desde el backend
      },
      Llaves.claveJWT);
      return token;
    }

    ValidarTokenJWT(token: string){
      try{
        let datos = jwt.verify(token, Llaves.claveJWT);
        return datos;
      } catch{
        return false;
      }
    }
}
