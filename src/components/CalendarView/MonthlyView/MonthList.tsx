import { useEffect, useRef } from "react";
import { setNewMonth } from "../../../utils/dateUtils";
import { format } from "date-fns";
import { isScreenMobile } from "../../utils";

interface MonthListProps {
  currentDate: Date;
  handleMonthClick: (date: Date) => void;
  mainColor: string;
  secondColor: string;
}

const MonthList: React.FC<MonthListProps> = ({
  currentDate,
  handleMonthClick,
  mainColor,
  secondColor,
}) => {
  const monthRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const currentMonthIndex = currentDate.getMonth();
    const currentMonthElement = monthRefs.current[currentMonthIndex];
    if (currentMonthElement && isScreenMobile()) {
      currentMonthElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentDate]);

  return (
    <ul className="mt-4 sm:mt-10 flex flex-row sm:flex-col overflow-auto">
      {Array.from({ length: 12 }).map((_, index) => {
        const monthDate = setNewMonth(currentDate, index);
        return (
          <li
            key={index}
            ref={(el) => (monthRefs.current[index] = el)}
            className={`py-2 text-lg p-2 font-semibold cursor-pointer addOpacity`}
            style={
              monthDate.getMonth() === currentDate.getMonth()
                ? { color: mainColor }
                : { color: secondColor }
            }
            onClick={() => handleMonthClick(monthDate)}
          >
            {format(monthDate, "MMMM")}
          </li>
        );
      })}
    </ul>
  );
};

export default MonthList;
