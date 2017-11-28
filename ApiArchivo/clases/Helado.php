<?php 

class Helado  
{
    public static function getUnHelado($id)
    {
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
        $consulta =$objetoAccesoDato->RetornarConsulta("SELECT * from helados WHERE `id`=$id");
        $consulta->execute();			
        return $consulta->fetchall(PDO::FETCH_ASSOC);
    }

    public static function getHelados()
    {
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
        $consulta =$objetoAccesoDato->RetornarConsulta("SELECT * from helados");
        $consulta->execute();			
        return $consulta->fetchall(PDO::FETCH_ASSOC);
    }

    public static function AgregarHelado($sabor,$tipo,$kg,$foto)
    {
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
        $consulta =$objetoAccesoDato->RetornarConsulta("INSERT INTO `helados`(`sabor`, `tipo`, `kg`, `foto`) 
        VALUES ('$sabor','$tipo',$kg,'$foto')");
        return $consulta->execute();			
    }

    public static function BorrarHelado($id)
    {
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
        $consulta =$objetoAccesoDato->RetornarConsulta("DELETE FROM `helados` WHERE `id`=$id");
        return $consulta->execute();
    }

    public static function getSabor($sabor)
    {
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
        $consulta =$objetoAccesoDato->RetornarConsulta("SELECT * from helados WHERE `sabor`='$sabor'");
        $consulta->execute();
        return $consulta->fetchall(PDO::FETCH_ASSOC);
    }
}


?>