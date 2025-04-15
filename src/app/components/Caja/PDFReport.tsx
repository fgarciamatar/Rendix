import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 700,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 700,
    // textDecoration: "underline",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 2,
  },
  totalBox: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: "black",
  },
  totalText: { fontSize: 14, fontWeight: 700, textAlign: "right" },
  efectivoBox: {
    marginTop: 30,
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 5,
  },
});

interface Movimiento {
  concepto: string;
  monto: number;
}

interface PDFReportProps {
  entradas: Movimiento[];
  salidas: Movimiento[];
  detalleEfectivo: Record<string, number>;
}

const agruparPorConcepto = (
  movimientos: Movimiento[]
): Record<string, number> => {
  const agrupado: Record<string, number> = {};
  movimientos.forEach(({ concepto, monto }) => {
    agrupado[concepto] = (agrupado[concepto] || 0) + monto;
  });
  return agrupado;
};

const PDFReport = ({ entradas, salidas, detalleEfectivo }: PDFReportProps) => {
  const entradasAgrupadas = agruparPorConcepto(entradas);
  const salidasAgrupadas = agruparPorConcepto(salidas);

  const totalEntradas = Object.values(entradasAgrupadas).reduce(
    (acc, val) => acc + val,
    0
  );
  const totalSalidas = Object.values(salidasAgrupadas).reduce(
    (acc, val) => acc + val,
    0
  );
  const diferencia = Math.abs(totalEntradas - totalSalidas);
  const estado =
    totalEntradas > totalSalidas
      ? "Sobrante"
      : totalSalidas > totalEntradas
      ? "Faltante"
      : "Sin diferencias";

  const totalEfectivo = Object.entries(detalleEfectivo).reduce(
    (acc, [den, cant]) => acc + Number(den) * cant,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Planilla de Caja</Text>

        <View style={styles.section}>
          <View style={styles.box}>
            <Text style={styles.subtitle}>Entradas</Text>
            {Object.entries(entradasAgrupadas).map(([concepto, monto]) => (
              <View key={concepto} style={styles.item}>
                <Text>{concepto}</Text>
                <Text>${monto.toFixed(2)}</Text>
              </View>
            ))}
            <Text style={styles.totalText}>
              Subtotal: ${totalEntradas.toFixed(2)}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.subtitle}>Salidas</Text>
            {Object.entries(entradasAgrupadas).map(
              ([concepto, monto], index) => (
                <View key={concepto || `entrada-${index}`} style={styles.item}>
                  <Text>{concepto || "Sin concepto"}</Text>
                  <Text>${monto.toFixed(2)}</Text>
                </View>
              )
            )}

            <Text style={styles.totalText}>
              Subtotal: ${totalSalidas.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>
            Total: ${diferencia.toFixed(2)} ({estado})
          </Text>
        </View>

        {Object.keys(detalleEfectivo).length > 0 && (
          <View style={styles.efectivoBox}>
            <Text style={styles.subtitle}>Detalle de Efectivo</Text>
            {Object.entries(detalleEfectivo)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([den, cant]) => (
                <View key={den} style={styles.item}>
                  <Text>
                    {cant} x ${Number(den).toLocaleString()}
                  </Text>
                  <Text>${(Number(den) * cant).toLocaleString()}</Text>
                </View>
              ))}
            <Text style={styles.totalText}>
              Total efectivo: ${totalEfectivo.toLocaleString()}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFReport;
