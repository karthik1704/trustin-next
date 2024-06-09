"use client";
import { formatDate, getDateRange, parseFormattedDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type InitialState = {
  fieldErrors?: {} | null;
  type?: string | null;
  message?: any | string | null;
};

const initialState: InitialState = {
  fieldErrors: {},
  type: null,
  message: null,
};

const { startDate: sDate, endDate: eDate } = getDateRange();
console.log(new Date(sDate).toISOString().split("T")[0]);
const DashboardForm = ({
  startDate,
  endDate,
}: {
  startDate: string | undefined;
  endDate: string | undefined;
}) => {
  const {
    control,
    register,
    formState: { isLoading, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      start_date: startDate
        ? new Date(parseFormattedDate(startDate)).toISOString().split("T")[0]
        : new Date(sDate).toISOString().split("T")[0],
      end_date: endDate
        ? new Date(parseFormattedDate(endDate)).toISOString().split("T")[0]
        : new Date(eDate).toISOString().split("T")[0],
    },
  });

  const router = useRouter();

  const handleForm = async (data: any) => {
    const { start_date, end_date } = data;
    const formatedStartDate = formatDate(start_date);
    const formatedEndDate = formatDate(end_date);
    const query = `start_date_str=${encodeURIComponent(formatedStartDate)}&end_date_str=${encodeURIComponent(formatedEndDate)}`;
    console.log(query);
    router.push(`/dashboard?${query}`);
  };

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <div>
        <div className="mb-4.5 flex flex-row gap-3 xl:flex-row">
          <div className="flex flex-row">
            <label className="mb-2.5 block text-black dark:text-white">
              Start Date
            </label>
            <input
              type="date"
              {...register(`start_date`)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="flex flex-row">
            <label className="mb-2.5 block text-black dark:text-white">
              End Date
            </label>
            <input
              type="date"
              {...register(`end_date`)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="flex justify-center rounded bg-primary p-2 font-medium text-gray"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DashboardForm;
