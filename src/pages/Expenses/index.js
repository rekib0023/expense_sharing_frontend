import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SidebarLayout from "../SidebarLayout";
import CreateCategory from "./components/CreateCategory";
import moment from "moment";
import Expense from "./components/Expense";
import { toast } from "react-toastify";

const Expenses = () => {
  const axiosPrivate = useAxiosPrivate();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getExpenses = async (e) => {
    try {
      const response = await axiosPrivate.get("/expense/", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/expense/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success("Expense deleted successfully");
    } catch (error) {
      error.response.data.status === 422
        ? toast.error(error.response.data.statusText)
        : toast.error(error.response.data.detail);
    } finally {
      getExpenses();
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

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  console.log(categories);
  useEffect(() => {
    getExpenses();
  }, []);

  const rowColor = ["bg-white", "bg-gray-50"];
  return (
    !isLoading && (
      <SidebarLayout>
        <div className="flex flex-row gap-x-4">
          <section id="expense-table">
            <div className="flex justify-between">
              <div className="flex gap-x-4">
                <h2 className="font-bold text-3xl">Expenses</h2>
                <Expense
                  children={"Add new"}
                  title="Create Expense"
                  categories={categories}
                />
              </div>
              <div className="flex gap-x-4">
                <select
                  id="categories"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected>Category</option>
                  {categories.map((e) => (
                    <option value={e.id}>{e.name}</option>
                  ))}
                </select>
                <select
                  id="payment"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected>Payment</option>
                  <option value="Bank">Bank</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>
            {expenses.length > 0 && (
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      #
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Name
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Category
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Paid Through
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Amount
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Expense/Earnings
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Payment Date
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Other Details
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Action
                    </th>
                  </tr>
                  {expenses.map((e, i) => (
                    <tr
                      className={`${
                        rowColor[i] % 2
                      } border-b  dark:border-gray-700`}
                      key={e.id}
                    >
                      <td className="p-3 text-sm text-gray-700">
                        <p>{i + 1}</p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p>{e.name}</p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p>{e.category.name}</p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p>
                          <span>
                            {e.paid_by === "Card" ? (
                              <i class="fi fi-rr-credit-card"></i>
                            ) : e.paid_by === "Cash" ? (
                              <i class="fi fi-sr-dollar"></i>
                            ) : e.paid_by === "Bank" ? (
                              <i class="fi fi-rr-bank"></i>
                            ) : (
                              ""
                            )}
                          </span>{" "}
                          {e.paid_by}
                        </p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p
                          className={
                            e.amount < 0 ? "text-red-800" : "text-green-800"
                          }
                        >
                          ₹ {e.amount.toFixed(2)}
                        </p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p>
                          {e.is_spend ? (
                            <span className="p-2 text-xs font-semibold uppercase tracking-wider text-red-800 bg-red-200 rounded-md">
                              Expense
                            </span>
                          ) : (
                            <span className="p-2 text-xs font-semibold uppercase tracking-wider text-green-800 bg-green-200 rounded-md">
                              Earnings
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p>
                          {" "}
                          {moment(e.payment_date).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        <p>{e.other_details || "N/A"}</p>
                      </td>
                      <td className="p-3 text-sm text-gray-700 flex justify-around">
                        <Expense
                          children={<i className="fi fi-rr-pencil"></i>}
                          title="Update Expense"
                          prevExpense={e}
                          categories={categories}
                        />
                        <button
                          type="button"
                          className="hover:cursor-pointer"
                          onClick={() => deleteExpense(e.id)}
                        >
                          <i className="fi fi-rr-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            )}
          </section>
          <section className="">
            {" "}
            <div className="flex justify-between">
              <div className="flex gap-x-4">
                <h2 className="font-bold text-3xl">Categories</h2>
                <CreateCategory />
              </div>
            </div>
          </section>
        </div>
      </SidebarLayout>
    )
  );
};

export default Expenses;
