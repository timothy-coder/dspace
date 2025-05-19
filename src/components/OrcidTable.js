import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 10 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, marginBottom: 10 },
  row: { flexDirection: 'row' },
  cell: { borderStyle: 'solid', borderWidth: 1, padding: 5, flexGrow: 1, textAlign: 'center' },
});

const OrcidTable = ({ data }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Reporte Diario de Ingresos</Text>
        {Object.keys(data).map((date) => (
          <View key={date}>
            <Text style={{ fontSize: 14, marginVertical: 5 }}>Fecha: {date}</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={styles.cell}>Clasificador</Text>
                <Text style={styles.cell}>Descripción</Text>
                <Text style={styles.cell}>Total Importe</Text>
              </View>
              {data[date].map((item, index) => (
                <View style={styles.row} key={index}>
                  <Text style={styles.cell}>{item.clasificador}</Text>
                  <Text style={styles.cell}>{item.descripcion}</Text>
                  <Text style={styles.cell}>{item.total.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default OrcidTable;
