import React from "react";
import { DatePicker as AntDataPicker } from "antd";
import locale from "antd/lib/date-picker/locale/fr_FR";
import dayjs from "dayjs";
import * as moment from "moment";

interface DatePickerProps {
  placeholder: string;
  picker?: "time" | "date" | "week" | "month" | "quarter" | "year" | undefined;
  name: string;
  onChange: (value: any) => void;
  defaultValue: moment.Moment;
}

const defaultPickerValue: any = dayjs().year(1989);

export const DatePicker: React.FC<DatePickerProps> = ({
  placeholder,
  name,
  picker,
  onChange,
  defaultValue,
}) =>
  picker ? (
    <AntDataPicker
      style={{ width: "100%", cursor: "pointer" }}
      id={name}
      placeholder={placeholder}
      picker={picker}
      locale={locale}
      size="large"
      defaultPickerValue={defaultPickerValue}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  ) : (
    <AntDataPicker
      id={name}
      placeholder={placeholder}
      showTime
      format="DD/MM/YYYY HH:mm"
      locale={locale}
    />
  );
