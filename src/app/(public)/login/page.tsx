"use client";
import Link from "next/link";
import { ILogin } from "@/models/Login";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTokenService } from "@/services/token.service";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    const formSchema = {
        email: "",
        password: "",
    };

    const validationScheme = yup.object().shape({
        email: yup.string().email("Please enter valid email").required("Email Address is Required"),
        password: yup
            .string()
            .min(3, ({ min }) => `Password must be at least ${min} characters`)
            .max(20, ({ max }) => `Password must be maximum ${max} characters`)
            .required("Password is required"),
    });

    const service = useTokenService();

    const formik = useFormik<ILogin>({
        initialValues: { ...formSchema } as ILogin,
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: async (login) => {
            const result = await service.login(login);
            console.log(result);

            if (result.message && result.token) {
                // Calcular a expiração como data ISO
                const expiresAt = new Date(Date.now() + result.expiresIn * 1000).toISOString();

                // Armazenar no localStorage
                localStorage.setItem("accessToken", result.token);
                localStorage.setItem("tokenExpiresAt", expiresAt);

                // Armazenar em cookies
                document.cookie = `accessToken=${result.token}; path=/; SameSite=Strict;`;
                document.cookie = `tokenExpiresAt=${expiresAt}; path=/; SameSite=Strict;`;

                // decodifica o token para pegar o scope
                const decodedToken: any = jwtDecode(result.token);
                const scopes = decodedToken.scope.split(" "); // divide os scopes em um array

                toast.success(result.message);
                router.push("/");
            } else if (result.error) {
                toast.error(result.error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full max-w-md flex flex-col justify-center items-center">
                <div className="text-center flex flex-col gap-2 px-4 items-center">
                    {/* <Image src={logoBlack} alt="logoImg" /> */}
                    <h1 className="text-6xl sm:text-4xl md:text-5xl text-slate-800 font-semibold">Welcome Back!</h1>
                    <p className="text-zinc-700">Log in to continue your adventure with TripCollab.</p>
                </div>
                <div className="flex flex-col text-start w-full gap-2 mt-4">
                    <input
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-3 border border-solid border-zinc-600 rounded-xl"
                        type="email"
                        name="email"
                        placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-base mt-1">{formik.errors.email}</p>
                    )}
                    <input
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-3 border border-solid border-zinc-600 rounded-xl"
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-base ">{formik.errors.password}</p>
                    )}
                    <div className="flex justify-between flex-col md:flex-row text-center md:text-lg text-base mt-1 ">
                        <small className="cursor-pointer text-slate-900 underline decoration-slice">
                            Forgot Password?
                        </small>
                        <small className="cursor-pointer text-slate-900 underline decoration-slice">
                            <Link href="/register">New to our platform? Register now.</Link>
                        </small>
                    </div>
                </div>
                <button
                    type="submit"
                    className="uppercase p-3 w-full font-semibold text-white shadow-md bg-teal-800 rounded-xl mt-4 hover:bg-teal-900 transition duration-300"
                >
                    Login
                </button>
            </div>
        </form>
    );
}
