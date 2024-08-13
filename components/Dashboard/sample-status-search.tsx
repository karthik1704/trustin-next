import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SampleStatusCheck = ({ sampleData }) => {
  const {
    control,
    register,
    formState: { isLoading, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      q: "",
    },
  });
  const { sample, status } = sampleData;

  const router = useRouter();

  const handleForm = async (data: any) => {
    const { q } = data;

    const query = `q=${encodeURIComponent(q)}`;
    console.log(query);
    router.push(`/dashboard?${query}`);
  };

  return (
    <div className="mb-4 mt-1 rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Check Sample Status
      </h4>
      <form onSubmit={handleSubmit(handleForm)}>
        <div className="w-full">
          <div className="mb-4.5 flex flex-row gap-2 xl:flex-row">
            <div className="flex w-1/2 flex-col">
              <label className="mb-2.5 w-[200px] text-black dark:text-white">
                Status Number
              </label>
              <input
                type="string"
                placeholder="TAS/24-25/1001"
                {...register(`q`)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-2">
            <button
              type="submit"
              className="flex justify-center rounded bg-primary p-2 font-medium text-gray"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Loading" : "Search"}
            </button>
          </div>
        </div>
      </form>
      {isLoading || (isSubmitting && <p>Featching Sample...</p>)}
      {status === 404 && (
        <div>
          <p
            className={`rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium`}
          >
            Sample not found.
          </p>
        </div>
      )}
      {!!sample && (
        <div>
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Sample ID
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      Test Type
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sample.sample_detail.map((detail) => (
                    <tr key={detail.id}>
                      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {sample.sample_id}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {detail.test_type_id === 1 ? "Micro" : "Mech"}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p
                          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium`}
                        >
                          {sample.sample_history.length
                            ? sample.sample_history.filter(
                                (history) =>
                                  history.test_type.id === detail.test_type_id,
                              )[0].to_status.name
                            : "Registered"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleStatusCheck;
