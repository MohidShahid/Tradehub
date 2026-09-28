import { CategoryArray } from "@/static/Categories";
import { Bold } from "lucide-react";

const Categories = () => {
  return (
    <div className=" flex flex-col py-10 gap-10 items-start px-10">
      {" "}
      <h1 className="text-(--color-primary) font-bold  text-2xl">Shop by Category</h1>
      <div className="flex items-start flex-wrap justify-around gap-3 w-full">
        {CategoryArray.map((category) => {
          const Icon = category.icon;

          return (
            <div key={category.name} className="flex items-center flex-col gap-2.5">
              <div className={`rounded-full p-4 ${category.color}`}>
                <Icon size={24} fontWeight={Bold} />
              </div>

              <p className="text-(--color-text-secondary) text-sm font-bold">{category.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
