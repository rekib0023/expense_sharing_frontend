import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ModalForm from "../../../components/ModalForm";
import { expenseFields } from "../../../constants/formFields";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const efields = expenseFields;
let efieldsState = {};
efields.forEach((field) => (efieldsState[field.id] = ""));

const Expense = ({ children, title, prevExpense, categories }) => {
  const axiosPrivate = useAxiosPrivate();

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseName, setExpenseName] = useState(prevExpense?.name || "");

  const [expensePaidBy, setExpensePaidBy] = useState(
    prevExpense?.paid_by || "Bank"
  );
  const [expenseAmount, setExpenseAmount] = useState(
    Math.abs(prevExpense?.amount) || 0.0
  );
  const [expenseCategory, setExpenseCategory] = useState(
    prevExpense?.category["id"] || categories[0]?.id
  );
  const now = new Date().toUTCString();
  let prev_date = null;
  if (prevExpense) prev_date = new Date(prevExpense?.payment_date);
  const [paymentTime, setPaymentTime] = useState(prev_date || dayjs(now));

  const [isSpend, setIsSpend] = useState(() => {
    return prevExpense ? prevExpense.is_spend : true;
  });

  const [otherDetails, setOtherDetails] = useState(
    prevExpense?.other_details || ""
  );

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
    value: paymentTime,
    inputType: "datetimepicker",
    handleChange: (e) => setPaymentTime(e),
  };

  efields[4]["fieldAttribs"] = {
    value: expensePaidBy,
    handleChange: (e) => setExpensePaidBy(e.target.value),
    inputType: "dropdown",
    dropdownList: [
      { id: "Bank", name: "Bank" },
      { id: "Card", name: "Card" },
      { id: "Cash", name: "Cash" },
    ],
  };

  efields[5]["fieldAttribs"] = {
    value: isSpend,
    handleChange: setIsSpend,
    inputType: "toggle",
  };

  efields[6]["fieldAttribs"] = {
    value: otherDetails,
    handleChange: (e) => setOtherDetails(e.target.value),
    inputType: "textarea",
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = prevExpense
        ? await axiosPrivate.put(
            `/expense/${prevExpense?.id}`,
            JSON.stringify({
              name: expenseName,
              paid_by: expensePaidBy,
              amount: expenseAmount,
              category_id: expenseCategory,
              is_spend: isSpend,
              payment_date: paymentTime.toISOString(),
              other_details: otherDetails,
            }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          )
        : await axiosPrivate.post(
            "/expense/",
            JSON.stringify({
              name: expenseName,
              paid_by: expensePaidBy,
              amount: expenseAmount,
              category_id: expenseCategory,
              is_spend: isSpend,
              payment_date: paymentTime.toISOString(),
              other_details: otherDetails,
            }),
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
      toast.success(
        prevExpense
          ? "Expense updated successfully"
          : "Expense created successfully"
      );
      setShowExpenseModal(false);
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
    const controller = new AbortController();

    if (prevExpense) {
      setExpenseName(prevExpense.name);
      setExpensePaidBy(prevExpense.paid_by);
      setExpenseAmount(prevExpense.amount);
      setExpenseCategory(prevExpense.category["id"]);
      setOtherDetails(prevExpense.other_details);
      setIsSpend(prevExpense.is_spend);
    } else {
      setExpenseName("");
      setExpensePaidBy("");
      setExpenseAmount(0.0);
      setExpenseCategory(null);
      setOtherDetails("");
      setIsSpend(true);
    }

    efields[1]["fieldAttribs"] = {
      ...efields[1]["fieldAttribs"],
      dropdownList: categories,
    };

    return () => {
      controller.abort();
    };
  }, [showExpenseModal]);

  return (
    <>
      <button
        className={
          !prevExpense
            ? "border-2 border-blue-900 text-blue-900 hover:text-white hover:bg-blue-900 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            : ""
        }
        type="button"
        onClick={() => setShowExpenseModal(true)}
      >
        {children}
      </button>
      {showExpenseModal && !isLoading ? (
        <ModalForm
          title={title}
          onClick={() => setShowExpenseModal(false)}
          fields={efields}
          handleSubmit={handleExpenseSubmit}
        />
      ) : null}
    </>
  );
};

export default Expense;
