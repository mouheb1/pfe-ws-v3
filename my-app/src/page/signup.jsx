import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import '../assets/css/style.css';
import logoEnova from '../assets/images/auth/logoEnova.png';
import urLogo from '../assets/images/auth/ur10e.gif';
import image1 from '../assets/images/auth/coming-soon-object1.png';
import image2 from '../assets/images/auth/coming-soon-object2.png';
import image3 from '../assets/images/auth/coming-soon-object3.png';
import image4 from '../assets/images/auth/polygon-object.svg';
import { serviceUser } from '../services/http-client.service';

const SignupPage = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const handleConnexionClick = () => {
        console.log('Bouton de connexion cliqué !');
        navigate('/login');
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const nom = e.target.elements.nom.value;
        const prenom = e.target.elements.prenom.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        let validationErrors = {};

        if (!nom) {
            validationErrors.nom = "Le nom d'utilisateur est requis";
        }
        if (!prenom) {
            validationErrors.prenom = "Le prénom est requis";
        }
        if (!email) {
            validationErrors.email = "L'email est requis";
        } else if (!validateEmail(email)) {
            validationErrors.email = "L'email n'est pas valide";
        }
        if (!password) {
            validationErrors.password = "Le mot de passe est requis";
        }
        if (password !== confirmPassword) {
            validationErrors.confirmPassword = "";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setAlert({ type: 'error', message: 'Veuillez corriger le mot de passe ci-dessous.' });
            return;
        }

        setErrors({});
        setAlert(null);

        const postData = async () => {
            try {
                const response = await serviceUser.signUp({ nom, prenom, email, password, role: "Admin" });
                if (!response.ok) {
                    throw new Error('Erreur lors de la requête');
                }
                setAlert({ type: 'success', message: 'Inscription réussie !' });
                setTimeout(() => navigate('/login'), 2000);
            } catch (error) {
                console.error('Erreur:', error.message);
                setAlert({ type: 'error', message: 'Votre adresse email est déjà existe' });
            }
        };

        postData();
    };

    return (
        <div className="main-container min-h-screen text-black dark:text-white-dark">
            <div x-data="auth">
                <div className="absolute inset-0"></div>
                <div className="relative flex min-h-screen items-center justify-center bg-[url(../images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                    <img src={image1} alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                    <img src={image2} alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                    <img src={image3} alt="image" className="absolute right-0 top-0 h-[300px]" />
                    <img src={image4} alt="image" className="absolute bottom-0 end-[28%]" />
                    <form onSubmit={handleSignup} className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                        <div style={{ background: 'linear-gradient(225deg,rgba(0,128,128,1) 0%,rgba(53,60,64,1) 100%)' }} className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(23,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-32 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                            <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                            <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                                <a href="#" className="block w-48 lg:w-72 ms-10">
                                    <img src={logoEnova} alt="Logo" className="w-full" />
                                </a>
                                <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                    <img src={urLogo} alt="Cover Image" className="w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                            <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                                <a href="#" className="block w-8 lg:hidden">
                                    <img src={logoEnova} alt="Logo" className="w-full" />
                                </a>
                            </div>
                            <div className="w-full max-w-xs">
                                <h1 className="mb-2 text-3xl font-semibold text-center dark:text-white">Bienvenue de nouveau !</h1>
                                <p className="mb-8 text-sm text-center text-black dark:text-white-dark">Connectez-vous à votre compte pour continuer</p>
                                {alert && (
                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Alert severity={alert.type}>
                                            <AlertTitle>{alert.type === 'error' ? 'Erreur' : 'Succès'}</AlertTitle>
                                            {alert.message}
                                        </Alert>
                                    </Stack>
                                )}
                                <div className="flex flex-col gap-4">
                                    <div className="relative">
                                        <input type="text" id="nom" name="nom" placeholder="Nom d'utilisateur" className="input w-full" required />
                                        {errors.nom && <p className="text-red-500">{errors.nom}</p>}
                                    </div>
                                    <div className="relative">
                                        <input type="text" id="prenom" name="prenom" placeholder="Prénom" className="input w-full" required />
                                        {errors.prenom && <p className="text-red-500">{errors.prenom}</p>}
                                    </div>
                                    <div className="relative">
                                        <input type="text" id="email" name="email" placeholder="Email" className="input w-full" required />
                                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="relative">
                                        <input type="password" id="password" name="password" placeholder="Mot de passe" className="input w-full" required />
                                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                                    </div>
                                    <div className="relative">
                                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmer le mot de passe" className="input w-full" required />
                                        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full">S'inscrire</button>
                                </div>
                                <p className="mt-8 text-sm text-center">Vous avez un compte ? <NavLink to="/login" className="text-primary hover:underline dark:text-white-light">Connectez-vous</NavLink></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <script src="../../public/assets/js/alpine-collaspe.min.js"></script>
            <script src="../../public/assets/js/alpine-persist.min.js"></script>
            <script defer src="../../public/assets/js/alpine-ui.min.js"></script>
            <script defer src="../../public/assets/js/alpine-focus.min.js"></script>
            <script defer src="../../public/assets/js/alpine.min.js"></script>
            <script src="../../public/assets/js/custom.js"></script>
        </div>
    );
};

export default SignupPage;
