import { useEffect, useState } from "react";
import ModalForm from "../../../components/ModalForm";
import { expenseCategoryFields } from "../../../constants/formFields";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ecfields = expenseCategoryFields;
let ecfieldsState = {};
ecfields.forEach((field) => (ecfieldsState[field.id] = ""));

const CreateCategory = () => {
  const axiosPrivate = useAxiosPrivate();

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [category, setCategory] = useState("");

  ecfields[0]["fieldAttribs"] = {
    value: category,
    handleChange: (e) => setCategory(e.target.value),
  };

  const handleExpenseCategorySubmit = async (e) => {
    e.preventDefault();
    setShowCategoryModal(false);
    try {
      const response = await axiosPrivate.post(
        "/expense/category",
        JSON.stringify({
          name: category,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCategory("");
  }, [showCategoryModal]);

  return (
    <>
      <button
        className="bg-blue-900 text-white hover:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowCategoryModal(true)}
      >
        Open regular modal
      </button>
      {showCategoryModal ? (
        <ModalForm
          title="Create Expense Category"
          onClick={() => setShowCategoryModal(false)}
          fields={ecfields}
          handleSubmit={handleExpenseCategorySubmit}
        />
      ) : null}
    </>
  );
};

export default CreateCategory;
