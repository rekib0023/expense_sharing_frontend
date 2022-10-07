import Input from "./Input";

const ModalForm = ({ title, onClick, fields, handleSubmit }) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-2/3 my-3 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-6 pb-0 rounded-t">
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
            <div className="relative px-6 flex-auto">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="">
                  <div class="grid grid-flow-col divide-x divide-indigo-100">
                    <div class="col-span-1 mr-2">
                      {fields.slice(0, 3).map((field) => (
                        <Input
                          key={field.id}
                          {...field.fieldAttribs}
                          labelText={field.labelText}
                          labelFor={field.labelFor}
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          isRequired={field.isRequired}
                          placeholder={field.placeholder}
                        />
                      ))}
                    </div>
                    <div class="col-span-1 pl-2">
                      {fields.slice(3).map((field) => (
                        <Input
                          key={field.id}
                          {...field.fieldAttribs}
                          labelText={field.labelText}
                          labelFor={field.labelFor}
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          isRequired={field.isRequired}
                          placeholder={field.placeholder}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClick}
                  >
                    Close
                  </button>
                  <button
                    className="bg-dark-purple text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ModalForm;
