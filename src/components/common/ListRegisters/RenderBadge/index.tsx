import { memo } from "react";
import { Text, View } from "react-native";
import { isDateToday, isDateTomorrow, isDatePast } from "@utils";

const RenderBadge = ({ type, date, isPaid }: any) => {
  let badgeText = "";
  let badgeColor = "";

  if (isPaid) {
    badgeText = "PAGO";
    badgeColor = "bg-green-500";
  } else if (isDateToday(date)) {
    badgeText = type === "expense" ? "VENCE HOJE" : "DISPONÍVEL HOJE";
    badgeColor = type === "expense" ? "bg-red-500" : "bg-green-500";
  } else if (isDateTomorrow(date)) {
    badgeText = type === "expense" ? "VENCE AMANHÃ" : "DISPONÍVEL AMANHÃ";
    badgeColor = type === "expense" ? "bg-red-500" : "bg-green-500";
  } else if (isDatePast(date)) {
    badgeText = type === "expense" ? "VENCIDO" : "DISPONÍVEL";
    badgeColor = type === "expense" ? "bg-red-500" : "bg-green-500";
  }

  return badgeText ? (
    <View
      className={`p-1 px-2 rounded-full absolute z-10 left-2 -top-3 ${badgeColor}`}
    >
      <Text className="text-white text-center font-black text-xs">
        {badgeText}
      </Text>
    </View>
  ) : null;
};

export default memo(RenderBadge);
