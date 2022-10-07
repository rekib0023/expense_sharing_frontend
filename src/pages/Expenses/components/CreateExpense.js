import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ModalForm from "../../../components/ModalForm";
import { expenseFields } from "../../../constants/formFields";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const efields = expenseFields;
let efieldsState = {};
efields.forEach((field) => (efieldsState[field.id] = ""));

const CreateExpense = () => {
  const axiosPrivate = useAxiosPrivate();

  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [expenseName, setExpenseName] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState("Bank");
  const [expenseAmount, setExpenseAmount] = useState(0.0);
  const [categories, setCategories] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState(categories[0]?.id);
  const [paymentTime, setPaymentTime] = useState(dayjs("2022-10-08"));


  const [isSpend, setIsSpend] = useState(true);

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

  const [otherDetails, setOtherDetails] = useState("")

  efields[6]["fieldAttribs"] = {
    value: otherDetails,
    handleChange: (e) => setOtherDetails(e.target.value),
    inputType: "textarea",
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        "/expense/",
        JSON.stringify({
          name: expenseName,
          paid_by: expensePaidBy,
          amount: expenseAmount,
          category_id: expenseCategory,
          is_spend: isSpend,
          payment_date: paymentTime.toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          //   signal: controller.signal,
        }
      );
      console.log(response);
      setShowExpenseModal(false);
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
        isMounted && setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    setIsLoading(true);
    getCategories();
    setIsLoading(false);

    setExpenseName("");
    setExpensePaidBy("");
    setExpenseAmount(0.0);
    setExpenseCategory(null);
    efields[1]["fieldAttribs"] = {
      ...efields[1]["fieldAttribs"],
      dropdownList: categories,
    };

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [showExpenseModal]);

  return (
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
          //   toggleTitle="Spent"
          //   isSpend={isSpend}
          //   toggleSetValue={setIsSpend}
        />
      ) : null}
    </>
  );
};

export default CreateExpense;
