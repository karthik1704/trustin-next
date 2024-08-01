"use client";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/submit-button/submit-button";
import { createUser } from "../actions";
import Select from "@/components/select-input";
import { Department } from "@/types/department";
import { TestType } from "@/types/test-type";
import { Role } from "@/types/role";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  roles: Role[];
  departments: Department[];
  test_types: TestType[];
};
const initalState = {
  fieldErrors: {
    first_name: undefined,
    last_name: undefined,
    username: undefined,
    email: undefined,
    phone: undefined,
    password: undefined,
    password2: undefined,
    role_id: undefined,
    department_id: undefined,
    qa_type_id: undefined,
  },
  type: null,
  message: null,
};
const NewUserForm = ({ roles, departments, test_types }: Props) => {
  const [state, formAction] = useFormState(createUser, initalState);
  const router = useRouter();
  useEffect(() => {
    if (state?.type === null) return;

    if (state?.type === "Error") {
      toast.error(state?.message, {
        duration: 10000,
        closeButton: true,
      });
    }
    if (state?.type === "Success") {
      toast.success(state?.message, {
        duration: 10000,
        closeButton: true,
      });
      router.push("/dashboard/users");
    }
  }, [state, router]);
  return (
    <form action={formAction}>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              First name
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            {state?.fieldErrors?.first_name && (
              <p className="text-red-500">{state?.fieldErrors?.first_name}</p>
            )}
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Last name
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            {state?.fieldErrors?.last_name && (
              <p className="text-red-500">{state?.fieldErrors?.last_name}</p>
            )}
          </div>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Email 
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {state?.fieldErrors?.email && (
            <p className="text-red-500">{state?.fieldErrors?.email}</p>
          )}
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Username <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <p className="text-slate-500">Username can only contain letters, numbers, and underscores</p>
          {state?.fieldErrors?.username && (
            <p className="text-red-500">{state?.fieldErrors?.username}</p>
          )}
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Phone <span className="text-meta-1">*</span>
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {state?.fieldErrors?.phone && (
            <p className="text-red-500">{state?.fieldErrors?.phone}</p>
          )}
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {state?.fieldErrors?.password && (
            <p className="text-red-500">{state?.fieldErrors?.password}</p>
          )}
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Confrim Password
          </label>
          <input
            type="password"
            name="password2"
            placeholder="Confrim Password"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {state?.fieldErrors?.password2 && (
            <p className="text-red-500">{state?.fieldErrors?.password2}</p>
          )}
        </div>

        <Select label="Role" name="role_id" error={state?.fieldErrors?.role_id}>
          {roles.map((role) => (
            <option value={role.id} key={role.id}>
              {role.name}
            </option>
          ))}
        </Select>

        <Select
          label="Department"
          name="department_id"
          error={state?.fieldErrors?.department_id}
        >
          {departments.map((department) => (
            <option value={department.id} key={department.id}>
              {department.name}
            </option>
          ))}
        </Select>

        <Select
          label="QC Type"
          name="qa_type_id"
          error={state?.fieldErrors?.qa_type_id}
        >
          <option value="null">-----</option>
          {test_types.map((test_type) => (
            <option value={test_type.id} key={test_type.id}>
              {test_type.name}
            </option>
          ))}
        </Select>

        <SubmitButton />
      </div>
    </form>
  );
};

export default NewUserForm;
