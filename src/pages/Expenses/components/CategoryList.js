import { useEffect, useState } from "react";
import CreateCategory from "../components/CreateCategory";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { Chart } from "react-google-charts";

const options = {
  pieHole: 0,
  is3D: false,
};

const CategoryList = ({ categories }) => {
  const axiosPrivate = useAxiosPrivate();

  const [showList, setShowList] = useState(false);
  const [categoryExpense, setCategoryExpense] = useState([]);
  const rowColor = ["bg-white", "bg-gray-50"];

  const deleteCategory = async (id) => {
    try {
      const response = await axiosPrivate.delete(`/expense/category/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.success("Category deleted successfully");
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    } catch (error) {
      error.response.data.status === 422
        ? toast.error(error.response.data.statusText)
        : toast.error(error.response.data.detail);
    }
  };

  const getCategoryExpense = async () => {
    try {
      const response = await axiosPrivate.get(`/charts/category_expense`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCategoryExpense(response.data);
    } catch (error) {
      error.response.data.status === 422
        ? toast.error(error.response.data.statusText)
        : toast.error(error.response.data.detail);
    }
  };

  useEffect(() => {
    getCategoryExpense();
  }, []);

  return (
    <div>
      <div className="flex justify-between  mb-4">
        <h2 className="font-bold text-3xl">
          Categories{" "}
          <span
            className="cursor-pointer"
            onClick={() => setShowList(!showList)}
          >
            {showList ? (
              <i class="fi fi-sr-angle-small-up"></i>
            ) : (
              <i class="fi fi-sr-angle-small-down"></i>
            )}
          </span>
        </h2>
        {showList && (
          <CreateCategory children={"Add New"} title="Create Category" />
        )}
      </div>
      {showList && categories.length > 0 && (
        <table className="w-full table-auto">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 w-20 text-sm font-semibold tracking-wide text-left">
                #
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Name
              </th>
              <th className="p-3 w-20 text-sm font-semibold tracking-wide text-center">
                Action
              </th>
            </tr>
            {categories.map((e, i) => (
              <tr
                className={`${rowColor[i] % 2} border-b  dark:border-gray-700`}
                key={e.id}
              >
                <td className="p-3 text-sm text-gray-700">
                  <p>{i + 1}</p>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <p>{e.name}</p>
                </td>
                <td className="p-3 text-sm text-gray-700 flex justify-around">
                  <CreateCategory
                    children={<i className="fi fi-rr-pencil"></i>}
                    title="Update Category"
                    prevCategory={e}
                  />
                  <button
                    type="button"
                    className="hover:cursor-pointer"
                    onClick={() => deleteCategory(e.id)}
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </thead>
        </table>
      )}

      <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={categoryExpense}
        // options={options}
        legendToggle
      />
    </div>
  );
};

export default CategoryList;
