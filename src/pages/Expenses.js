import React, { useEffect, useState } from "react";
import ModalForm from "../components/ModalForm";
import { expenseCategoryFields, expenseFields } from "../constants/formFields";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SidebarLayout from "./SidebarLayout";

const ecfields = expenseCategoryFields;
let ecfieldsState = {};
ecfields.forEach((field) => (ecfieldsState[field.id] = ""));

const efields = expenseFields;
let efieldsState = {};
ecfields.forEach((field) => (efieldsState[field.id] = ""));

const Expenses = () => {
  const axiosPrivate = useAxiosPrivate();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [category, setCategory] = useState("");

  ecfields[0]["fieldAttribs"] = {
    value: category,
    handleChange: (e) => setCategory(e.target.value),
  };

  const [expenseName, setExpenseName] = useState("");
  const [expenseType, setExpenseType] = useState("Bank");
  const [expenseAmount, setExpenseAmount] = useState(0.0);
  const [categories, setCategories] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState(categories[0]?.id);

  const [isLoading, setIsLoading] = useState(false);

  efields[0]["fieldAttribs"] = {
    value: expenseName,
    handleChange: (e) => setExpenseName(e.target.value),
  };

  efields[1]["fieldAttribs"] = {
    value: expenseCategory,
    handleChange: (e) => setExpenseCategory(e.target.value),
    inputType: "dropdown",
    dropdownList: categories,
  };

  efields[2]["fieldAttribs"] = {
    value: expenseAmount,
    handleChange: (e) => setExpenseAmount(e.target.value),
  };

  efields[3]["fieldAttribs"] = {
    value: expenseType,
    handleChange: (e) => setExpenseType(e.target.value),
    inputType: "dropdown",
    dropdownList: [
      { id: "Bank", name: "Bank" },
      { id: "Card", name: "Card" },
      { id: "Cash", name: "Cash" },
    ],
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
          //   signal: controller.signal,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setShowExpenseModal(false);
    try {
      const response = await axiosPrivate.post(
        "/expense/",
        JSON.stringify({
          name: expenseName,
          type: expenseType,
          amount: expenseAmount,
          category_id: expenseCategory,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          //   signal: controller.signal,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCategories = async () => {
      try {
        const response = await axiosPrivate.get("expense/categories", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    setIsLoading(true);
    getCategories();
    setIsLoading(false);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setCategory("");
    setExpenseName("");
    setExpenseType("");
    setExpenseAmount(0.0);
    setExpenseCategory(null);
  }, [showCategoryModal, showExpenseModal]);

  useEffect(() => {
    efields[1]["fieldAttribs"] = {
      ...efields[1]["fieldAttribs"],
      dropdownList: categories,
    };
  });

  return (
    <SidebarLayout>
      <div>Expenses</div>
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
      <>
        <button
          className="bg-blue-900 text-white hover:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowExpenseModal(true)}
        >
          Open Expense modal
        </button>
        {showExpenseModal && !isLoading ? (
          <ModalForm
            title="Create Expense"
            onClick={() => setShowExpenseModal(false)}
            fields={efields}
            handleSubmit={handleExpenseSubmit}
          />
        ) : null}
      </>
    </SidebarLayout>
  );
};

export default Expenses;
