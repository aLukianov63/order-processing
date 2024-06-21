import { Order } from "@/types/Order";
import {
  Page,
  Text,
  View,
  Font,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Регистрация шрифта
Font.register({
  family: "JetBrains Mono",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

// Стили для документа
const styles = StyleSheet.create({
  page: {
    fontFamily: "JetBrains Mono",
    padding: 30,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
    padding: 10,
    fontSize: 12,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f2f2f2",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: 700,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  totalSection: {
    marginTop: 20,
    textAlign: "right",
    marginRight: 10,
  },
  signatureSection: {
    marginTop: 40,
    textAlign: "left",
    marginLeft: 10,
    fontSize: 12,
  },
  bold: {
    fontWeight: "bold",
  },
  underline: {
    textDecoration: "underline",
  },
});

// Типы для заказа
type OrderProps = {
  order: Order;
};

// Компонент OrderReport
const OrderReport = ({ order }: OrderProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        Накладная № {order.id} от{" "}
        {new Date(order.createAt).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        г.
      </Text>
      <View style={styles.section}>
        <Text>
          <Text style={styles.bold}>Продавец:</Text> ООО «Компания», ИНН
          1234567890
        </Text>
        <Text>Адрес продавца: Москва, ул. Ленина 1/1</Text>
        <Text>
          <Text style={styles.bold}>Покупатель:</Text>{" "}
          {order.details.contactPerson}, ИНН 123456789123
        </Text>
        <Text>Адрес покупателя: {order.details.deliveryAddress}</Text>
        <Text>Основание для отпуска: Договор №45 от 10.10.2016г</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>№</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Товар</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Ед.</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Цена</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Кол-во</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Сумма</Text>
          </View>
        </View>
        {order.lines.map((line, index) => (
          <View style={styles.tableRow} key={line.product.id}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{line.product.title}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>шт</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{line.product.price} руб.</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{line.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {line.quantity * line.product.price} руб.
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text>Всего отпущено: {order.lines.length} наименования</Text>
        <Text>
          На сумму: <Text style={styles.bold}>{order.totalPrice} руб.</Text>
        </Text>
        <Text>
          в том числе НДС 18%:{" "}
          <Text style={styles.bold}>{order.totalPrice * 0.18}₽</Text>
        </Text>
      </View>
      <View style={styles.signatureSection}>
        <Text>
          Отпуск разрешил ____________________ (должность) _____________
          (Ф.И.О.)
        </Text>
        <Text>
          Отпустил ____________________ (должность) _____________ (Ф.И.О.)
        </Text>
        <Text>
          Получил ____________________ (должность) _____________ (Ф.И.О.)
        </Text>
      </View>
    </Page>
  </Document>
);

export default OrderReport;
