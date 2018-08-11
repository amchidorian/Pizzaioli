<?php

namespace App\Controller;

use App\Entity\Membre;
use App\Entity\Pizzeria;
use App\Entity\User;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class RestController extends Controller
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @Route("/check_user", name="check_user")
     * @param Request $datas
     * @Method({"POST"})
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function check_user(Request $datas)
    {
        $email = $datas->request->get('mail');
        $repository = $this->getDoctrine()->getRepository(User::class);
        $user = $repository->findOneBy(['email' => $email]);
        if ($user == null):
            return $this->json($this->register_user($datas), 200);
        else:
            return $this->json(array('mail' => false), 200);
        endif;
    }

    /**
     * @Route("/register_user", name="register_user")
     * @param $datas
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function register_user($datas)
    {
        $em = $this->getDoctrine()->getManager();
        if ($datas->request->get('role') == 'membre'):
            return array('register' => $this->register_membre($datas, $em));
        else:
            return $this->json($this->register_pizzeria($datas, $em), 200);
        endif;

    }

    /**
     * @param Request $datas
     * @param ObjectManager $em
     * @return array
     */
    protected function register_membre(Request $datas, $em)
    {
        $user = new User();
        $membre = new Membre();
        $user->setAdresse($datas->request->get('adresse'))
            ->setCodePostal($datas->request->get('code_postal'))
            ->setRole($datas->request->get('role'))
            ->setVille($datas->request->get('ville'))
            ->setEmail($datas->request->get('mail'))
            ->setPassword($datas->request->get('pass'))
            ->setNewsletter($datas->request->get('newsletter'))
            ->setNum($datas->request->get('num'));
        $hash = $this->encoder->encodePassword($user, $user->getPassword());
        $user->setPassword($hash);
        $membre->setUser($user)
            ->setNom($datas->request->get('nom'))
            ->setPrenom($datas->request->get('prenom'))
            ->setAge($datas->request->get('age'))
            ->setSexe($datas->request->get('sexe'))
            ->setGeolocalisation($datas->request->get('geo'));
        $em->persist($user);
        $em->persist($membre);
        $em->flush();
        return true;
    }

    /**
     * @param $datas
     * @param ObjectManager $em
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    protected function register_pizzeria($datas, $em)
    {
        $user = new User();
        $pizzeria = new Pizzeria();
        $user->setAdresse($datas->request->get('adresse'))
            ->setCodePostal($datas->request->get('code_postal'))
            ->setRole($datas->request->get('role'))
            ->setVille($datas->request->get('ville'))
            ->setEmail($datas->request->get('mail'))
            ->setPassword($datas->request->get('pass'))
            ->setNewsletter($datas->request->get('newsletter'))
            ->setNum($datas->request->get('num'));
        $hash = $this->encoder->encodePassword($user, $user->getPassword());
        $user->setPassword($hash);
        $pizzeria->setUser($user)
            ->setStatut(false)
            ->setNom($datas->request->get('nom'))
            ->setDescription($datas->request->get('description'))
            ->setFour($datas->request->get('four'));
        $em->persist($user);
        $em->persist($pizzeria);
        $em->flush();
        return array('register' => true);
    }

//    /**
//     * @Route("/verify_user", name="verify_user")
//     * @Method({"POST"})
//     * @param Request $datas
//     * @param ObjectManager $em
//     * @return \Symfony\Component\HttpFoundation\Response
//     */
//    public function verify_user(Request $datas, ObjectManager $em)
//    {
//        $email = $datas->request->get('mail');
//        $password = $datas->request->get('pass');
//
//        if ($user !== null):
//            $pass = $repository->findOneBy(['password' => $password]);
//            if ($pass !== null):
//                 if ($user !== null):
////            $pass = $repository->findOneBy(['password' => $password]);
//            else:
//                return $this->json(array('pass' => false), 200);
//            endif;
//        else:
//            return $this->json(array('email' => false), 200);
//        endif;
//    }

}