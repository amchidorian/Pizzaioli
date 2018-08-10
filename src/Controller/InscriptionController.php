<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class InscriptionController extends Controller
{
    /**
     * @Route("/inscription", name="inscription")
     */
    public function index()
    {
        return $this->render('inscription/inscription.html.twig', [
            'controller_name' => 'InscriptionController',
        ]);
    }
}
