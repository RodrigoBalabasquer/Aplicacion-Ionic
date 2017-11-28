<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Credentials: true");


require './composer/vendor/autoload.php';
require_once './clases/AccesoDatos.php';
require_once './clases/cdApi.php';
require_once "./clases/HeladoApi.php";
require_once './clases/AutentificadorJWT.php';
require_once './clases/MWparaCORS.php';
require_once './clases/MWparaAutentificar.php';

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;



$app = new \Slim\App(["settings" => $config]);

$app->group('/archivo', function () {
  $this->get('/', \HeladoApi::class . ':Leer');  
  $this->post('/', \HeladoApi::class . ':Archivo'); 
 });

 
 


$app->run();