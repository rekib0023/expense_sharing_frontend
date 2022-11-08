import { useEffect, useState } from "react";
import ModalForm from "../../../components/ModalForm";
import { expenseCategoryFields } from "../../../constants/formFields";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const ecfields = expenseCategoryFields;
let ecfieldsState = {};
ecfields.forEach((field) => (ecfieldsState[field.id] = ""));

const CreateCategory = ({ children, title, prevCategory }) => {
  const axiosPrivate = useAxiosPrivate();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  console.log(prevCategory?.name);

  const [category, setCategory] = useState(prevCategory?.name || "");

  ecfields[0]["fieldAttribs"] = {
    value: category,
    handleChange: (e) => setCategory(e.target.value),
  };

  const handleExpenseCategorySubmit = async (e) => {
    e.preventDefault();
    setShowCategoryModal(false);
    try {
      const response = prevCategory
        ? await axiosPrivate.put(
            `/expense/category/${prevCategory?.id}`,
            JSON.stringify({ name: category }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          )
        : await axiosPrivate.post(
            "/expense/category",
            JSON.stringify({
              name: category,
            }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
      toast.success(
        prevCategory
          ? "Category created successfully!"
          : "Category updated successfully!"
      );
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      error.response.data.status === 422
        ? toast.error(error.response.data.statusText)
        : toast.error(error.response.data.detail);
    }
  };

  useEffect(() => {
    if (prevCategory) setCategory(prevCategory.name);
    else setCategory("");
  }, [showCategoryModal]);

  return (
    <>
      <button
        className={
          !prevCategory
            ? "border-2 border-blue-900 text-blue-900 hover:text-white hover:bg-blue-900 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            : ""
        }
        type="button"
        onClick={() => setShowCategoryModal(true)}
      >
        {children}
      </button>
      {showCategoryModal ? (
        <ModalForm
          title={title}
          onClick={() => setShowCategoryModal(false)}
          fields={ecfields}
          handleSubmit={handleExpenseCategorySubmit}
        />
      ) : null}
    </>
  );
};

export default CreateCategory;
