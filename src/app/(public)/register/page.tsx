"use client";
import { IRegister } from "@/models/Register";
import useTokenService from "@/services/token.service";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function Register() {
    const router = useRouter();

    const formSchema = {
        username: "",
        email: "",
        password: "",
    };

    const validationScheme = yup.object().shape({
        username: yup
            .string()
            .min(3, ({ min }) => `Username must be at least ${min} characters`)
            .max(50, ({ max }) => `Username must be maximum ${max} characters`)
            .required("Username is required"),
        email: yup.string().email("Please enter valid email").required("Email Address is Required"),
        password: yup
            .string()
            .min(3, ({ min }) => `Password must be at least ${min} characters`)
            .required("Password is required"),
    });

    const service = useTokenService();

    const formik = useFormik<IRegister>({
        initialValues: { ...formSchema } as IRegister,
        enableReinitialize: true,
        validationSchema: validationScheme,
        onSubmit: async (register) => {
            const result = await service.register(register);

            if (result.message && result.token) {
                // salva o token no localStorage
                localStorage.setItem("accessToken", result.token);
                localStorage.setItem("tokenExpiresAt", (Date.now() + result.expiresIn! * 1000).toString());
                // pegando o valor da hora atual, adicionando o tempo de duração do token e tranformando de segundos para milissegundos

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
            <div className="flex flex-col justify-center items-center">
                <div className="text-center flex flex-col gap-2 px-4 items-center">
                    <h1 className="text-6xl text-slate-900 sm:text-4xl md:text-5xl font-semibold ">Join TripCollab</h1>
                    <p className="text-zinc-700">Register and take advantage of tips to improve your travels.</p>
                </div>

                <div className="flex flex-col text-start w-full gap-2 m-4">
                    <input
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="p-3 border border-solid border-zinc-600 rounded-xl"
                        type="text"
                        name="username"
                        placeholder="Username"
                    />
                    {formik.touched.username && formik.errors.username && (
                        <p className="text-red-500 text-base mt-1">{formik.errors.username}</p>
                    )}
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
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-base mt-1">{formik.errors.password}</p>
                    )}
                    <small className="inline-block underline decoration-slice text-sm text-center">
                        <Link className="ursor-pointer" href={"/login"}>
                            Already have Account? Login now.
                        </Link>
                    </small>
                </div>

                <button
                    type="submit"
                    className="uppercase p-3 w-full font-semibold text-white shadow-md bg-teal-800 rounded-xl  hover:bg-teal-900 transition duration-300"
                >
                    Register
                </button>
            </div>
        </form>
    );
}
