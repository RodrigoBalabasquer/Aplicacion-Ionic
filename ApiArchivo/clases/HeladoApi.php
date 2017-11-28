<?php


require_once 'cd.php';
require_once "Helado.php";
require_once 'IApiUsable.php';

class HeladoApi extends Helado implements IApiUsable
{
     public function TraerUno($request, $response, $args) {
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
        return $NuevaRespuesta;
     }

     public function TraerTodos($request, $response, $args) {
      	$todosLosHel=Helado::getHelados();
     	$newresponse = $response->withJson($todosLosHel, 200);  
    	return $newresponse;
    }

      public function CargarUno($request, $response, $args) {
     	
        $objDelaRespuesta= new stdclass();
        
        $ArrayDeParametros = $request->getParsedBody();
        //var_dump($ArrayDeParametros);
        $sabor= $ArrayDeParametros['sabor'];
        $tipo= $ArrayDeParametros['tipo'];
        $kg= $ArrayDeParametros['kg'];
        $foto= $ArrayDeParametros["foto"];

        if(Helado::AgregarHelado($sabor,$tipo,$kg,$foto))
            $objDelaRespuesta->respuesta="Helado AGREGADO.";         
        else 
            $objDelaRespuesta->respuesta="Helado NO agregado";  

        return $response->withJson($objDelaRespuesta, 200);
    }

      public function BorrarUno($request, $response, $args) {
     	$ArrayDeParametros = $request->getParsedBody();
     	$id=$ArrayDeParametros['id'];
     	$band=Helado::BorrarHelado($id);

     	$objDelaRespuesta= new stdclass();
	    if($band)
			$objDelaRespuesta->resultado="borro!!!";
		else
			$objDelaRespuesta->resultado="no Borro!!!";
			
	    $newResponse = $response->withJson($objDelaRespuesta, 200);  
      	return $newResponse;
    }

     
     public function ModificarUno($request, $response, $args) {
     	//$response->getBody()->write("<h1>Modificar  uno</h1>");
     	$ArrayDeParametros = $request->getParsedBody();
	    //var_dump($ArrayDeParametros);    	
	    $micd = new cd();
	    $micd->id=$ArrayDeParametros['id'];
	    $micd->titulo=$ArrayDeParametros['titulo'];
	    $micd->cantante=$ArrayDeParametros['cantante'];
	    $micd->año=$ArrayDeParametros['anio'];

	   	$resultado =$micd->ModificarCdParametros();
	   	$objDelaRespuesta= new stdclass();
		//var_dump($resultado);
		$objDelaRespuesta->resultado=$resultado;
        $objDelaRespuesta->tarea="modificar";
		return $response->withJson($objDelaRespuesta, 200);		
    }

    public function traerUnSabor($request, $response, $args){
        $objDelaRespuesta= new stdclass();
        $sabor=$args['sabor'];
        $elH=Helado::getSabor($sabor);

        if($elH == null)
        {
            $objDelaRespuesta->resultado="el sabor no existe";
            $NuevaRespuesta = $response->withJson($objDelaRespuesta, 200);
            return $NuevaRespuesta;
        }

        foreach ($elH as $item) {
            if($item["kg"]==0)
            {
                $objDelaRespuesta->resultado="no ai ma";
                $NuevaRespuesta = $response->withJson($objDelaRespuesta, 200);
                return $NuevaRespuesta;
            }
        }

        $NuevaRespuesta = $response->withJson($elH, 200);   
        return $NuevaRespuesta;
    }

    public function Archivo($request, $response, $args)
    {
        $objDelaRespuesta= new stdclass();
        $ArrayDeParametros = $request->getParsedBody();
        //var_dump($archivos);
        //var_dump($archivos['foto']);
        if(isset($ArrayDeParametros["nuevo"]) && isset($ArrayDeParametros["path"]))
        {
            $archivo = fopen("fotos/".$ArrayDeParametros["path"],"a");
            $string = "\r\n". $ArrayDeParametros["nuevo"][0] .";".$ArrayDeParametros["nuevo"][1] .";".$ArrayDeParametros["nuevo"][2];
            $escribo = fwrite($archivo,$string);
    
            if($escribo > 0)
                $objDelaRespuesta = $response->withJson("GUARDO", 200);
            else
            $objDelaRespuesta = $response->withJson("MAL", 200);
    
            fclose($archivo);
            
        }

        if(isset($_FILES['file']))
        {
            $nombreAnterior=$_FILES['file']["name"];
            $destino="./fotos/".$nombreAnterior;
            move_uploaded_file($_FILES["file"]["tmp_name"],$destino);
            //$objDelaRespuesta = $response->withJson("GUARDO", 200);

            
            $csvData = file_get_contents($destino);
            $lines = explode(PHP_EOL, $csvData);
            $array = array();
            foreach ($lines as $line) {
                $array[] =str_getcsv($line,";");
            }

            $objDelaRespuesta = $response->withJson($array, 200)/*$response->getBody()->write(json_encode($array))*/;
        }

        

         
        
        return $objDelaRespuesta;
    }

    public function Leer($request,$response,$args)
    {
        $otroarray;
        $csvData = file_get_contents("fotos/prueba.csv");
        $lines = explode(PHP_EOL, $csvData);
        $array = array();
        foreach ($lines as $line) {
            $array[] = str_getcsv($line);
            break;
        }

        foreach ($array as $item) {
            $otroarray[]=utf8_encode($item);
        }
/*
        $csv = array();
        $lines = file('fotos/prueba.csv', FILE_IGNORE_NEW_LINES);
        
        foreach ($lines as $key => $value)
        {
            $csv[$key] = str_getcsv($value);
        }*/
        
        //var_dump($array);
        $objDelaRespuesta = $response->withJson($otroarray, 200);
        return $objDelaRespuesta;
    }

}

?>