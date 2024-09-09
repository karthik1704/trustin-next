import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatusStepper from "./status-stepper";
import {
  Data,
  History,
 
} from "./typings";
import WorkFlowForm from "./invoice-workflow-begin-form";
import UnderTestingForm from "./under-testing-form";
import { User } from "@/types/user";
import Select from "@/components/select-input";
import EmailPopup from "./email-popup";

type Props = {
  data: Data;

  current_step: number;
  openModal: () => void;
  actionFn: (
    prevState: any,
    data: FormData,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  actionFnResult: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  actionFnReject: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  formAction: (data: FormData) => void;
};

const CombineWorkflow = ({
  data,
 
  current_step,
  openModal,
  actionFn,
  actionFnReject,
  actionFnResult,
  formAction,
}: Props) => {
  
  return (
    <div className="mb-3 w-full flex-col">
      <StatusStepper step={current_step} />
     

      { data.invoice.invoice_history.at(0)?.comments && (
        <Alert
          variant={
            data.invoice.invoice_history?.[0]?.from_status_id !== undefined
              ? data.invoice.invoice_history[0].from_status_id > current_step
                ? "destructive"
                : "success"
              : "default"
          }
        >
          <AlertTitle>Comment!</AlertTitle>
          <AlertDescription className="pl-5 font-medium">
            - {data.invoice.invoice_history.at(0)?.comments ?? "---"}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-1 flex flex-col gap-9">
        {current_step === 1 && (
          <WorkFlowForm
            currentStep={current_step}
            actionData={formAction}
            assign={data?.currentUser?.id as number}
            status={data?.invoice?.status != "Submitted" ? "Submitted" : ""}
            status_id={2}
            buttonName="Submit for Approval"
          />
        )}
        {current_step === 2 && (
          
           
            <UnderTestingForm
              data={data}
              showRejectButton={true}
              rejectActionData={actionFnReject}
              currentStep={current_step}
              assigned_to={data.invoice.assigned_to as number}
              patchFn={actionFnResult}
              step={3}
              openModal={openModal}

            />
         
        )}

        {current_step === 3 && (
         
          <UnderTestingForm
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.invoice.assigned_to}
            patchFn={actionFnResult}
            step={4}
            openModal={openModal}

          />
        )}

        
       
        {current_step === 4 && (
          <div className="mb-3 text-center">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {/* <EmailPopup
                filename={data.invoice.invoice_code}
                data={data}
                qr={ ""}
                isDraft={false}
                to={data.invoice.customer_email}

              /> */}
              <button
                type="button"
                onClick={() => openModal && openModal()}
                className="flex w-1/5 justify-center rounded bg-primary p-2 font-medium text-gray"
              >
                Print 
              </button>

              {/* <button
                type="button"
                onClick={() => openModal && openModal("Copy")}
                className="flex w-1/5 justify-center rounded bg-primary p-2 font-medium text-gray"
              >
                Print Copy
              </button> */}
              {/* <EmailPopup  filename={data.sample.sample_id} pdf={}/> */}
            </div>

            <h4 className="text-title-xl2 font-bold">
              Invoice WorkFlow Completed
            </h4>
            {/* {([1,2].includes(data.currentUser.department_id) || data.currentUser.role_id===9)  && (
              <WorkFlowForm
                currentStep={current_step}
                actionData={formAction}
                assign={data?.invoice?.assigned_to}
                status={""}
                status_id={3}
                buttonName="Go Back"
              />
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombineWorkflow;
