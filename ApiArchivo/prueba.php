<?php
class Prueba
{

public static function Prueba($request, $response, $args) {
    echo $request;
    /*
    $id=$args['id'];
    $elH=Helado::getUnHelado($id);
    if($elH==null)
    {
        $objDelaRespuesta= new stdclass();
        $objDelaRespuesta->error="El helado no existe";
        $NuevaRespuesta = $response->withJson($objDelaRespuesta, 500); 
    }
    else
        $NuevaRespuesta = $response->withJson($elH, 200);   
    return $NuevaRespuesta;*/
 }
}
?>