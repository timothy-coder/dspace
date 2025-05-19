import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  section: { marginBottom: 10 },
  text: { fontSize: 12 },
});

const ReportPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Reporte Diario de Ingresos</Text>
      {Object.keys(data).map((date) => (
        <View key={date} style={styles.section}>
          <Text style={styles.text}>Fecha: {date}</Text>
          {data[date].map((item, index) => (
            <Text key={index} style={styles.text}>
              {item.clasificador}: {item.total.toFixed(2)}
            </Text>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default ReportPDF;
