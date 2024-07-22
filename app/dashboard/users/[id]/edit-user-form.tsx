"use client";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/submit-button/submit-button";
import Select from "@/components/select-input";
import { Department } from "@/types/department";
import { TestType } from "@/types/test-type";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  user: User;
  roles: Role[];
  departments: Department[];
  test_types: TestType[];
  actionFn: (
    prevState: any,
    formData: FormData,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
};
type InitialState = {
  fieldErrors?: {
    first_name: undefined | string;
    last_name: undefined | string;
    username: undefined | string;
    email: undefined | string;
    phone: undefined | string;
    role_id: undefined | string[];
    department_id: undefined | string[];
    qa_type_id: undefined | string[];
  } | null;
  type?: string | null;
  message?: any | string | null;
};

const initialState: InitialState = {
  fieldErrors: {
    first_name: undefined,
    last_name: undefined,
    username: undefined,
    email: undefined,
    phone: undefined,
    role_id: undefined,
    department_id: undefined,
    qa_type_id: undefined,
  },
  type: null,
  message: null,
};
const EditUserForm = ({
  roles,
  departments,
  test_types,
  user,
  actionFn,
}: Props) => {
  const [state, formAction] = useFormState(actionFn, initialState);
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
              defaultValue={user.first_name}
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
              defaultValue={user.last_name}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          {state?.fieldErrors?.last_name && (
            <p className="text-red-500">{state?.fieldErrors?.last_name}</p>
          )}
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Email <span className="text-meta-1">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            defaultValue={user.email}
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
            defaultValue={user.username}
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
            placeholder="Enter your Phone Number"
            defaultValue={user.phone}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          {state?.fieldErrors?.phone && (
            <p className="text-red-500">{state?.fieldErrors?.phone}</p>
          )}
        </div>

        <Select
          label="Role"
          name="role_id"
          defaultValue={user.role_id}
          error={state?.fieldErrors?.role_id}
        >
          {roles.map((role) => (
            <option value={role.id} key={role.id}>
              {role.name}
            </option>
          ))}
        </Select>

        <Select
          label="Deparment"
          name="department_id"
          defaultValue={user.department_id}
          error={state?.fieldErrors?.department_id}
        >
          {departments.map((department) => (
            <option value={department.id} key={department.id}>
              {department.name}
            </option>
          ))}
        </Select>

        <Select
          label="QA Type"
          name="qa_type_id"
          defaultValue={user.qa_type_id}
          error={state?.fieldErrors?.qa_type_id}
        >
          <option value="null">-----</option>

          {test_types.map((test_type) => (
            <option value={test_type.id} key={test_type.id}>
              {test_type.name}
            </option>
          ))}
        </Select>
      </div>
      <SubmitButton />
    </form>
  );
};

export default EditUserForm;
