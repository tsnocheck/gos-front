import { Text } from "@react-pdf/renderer";
import { currentYear } from "../../shared/utils";
import type { FC } from "react";
import type { CreateProgramForm, User } from "@/types";
import { PDFPage } from "../../shared/ui/PDFPage";

export const ApprovalPage: FC<{
  program: CreateProgramForm;
  allAuthors: User[];
}> = ({ program, allAuthors }) => {
  return (
    <PDFPage title="ЛИСТ СОГЛАСОВАНИЯ">
      <Text style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          Разработчик(и) программы: {"\n"}
        </Text>
        {allAuthors.map(({ lastName, firstName, middleName }) => (
          <>
            <Text>
              {(lastName ?? "") +
                " " +
                (firstName ?? "") +
                " " +
                (middleName ?? "")}
              {"\n"}
            </Text>
          </>
        ))}
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Дополнительная профессиональная программа повышения квалификации "
        {program.title || "Название Программы"}", прошла экспертизу:
      </Text>

      <Text style={{ marginBottom: 5 }}>Эксперт 1: -</Text>
      <Text style={{ marginBottom: 20 }}>Эксперт 2: -</Text>

      <Text>
        Дополнительная профессиональная программа повышения квалификации "
        {program.title || "Название Программы"}" утверждена Учёным советом
        Калининградского областного института развития образования (протокол №
        ___ от ______ {currentYear} г.)
      </Text>
    </PDFPage>
  );
};
