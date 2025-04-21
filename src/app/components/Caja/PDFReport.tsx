import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" }, // fuente general más chica
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  dateTurno: {
    fontSize: 12,
    textAlign: "right",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    width: "48%",
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 700,
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
  totalText: { fontSize: 12, fontWeight: 700, textAlign: "right" },
  efectivoBox: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 5,
  },
  efectivoText: {
    fontSize: 9, // más chico el detalle de efectivo
  },
});

interface Movimiento {
  concepto: string;
  monto: number;
}
type EstadoCaja = {
  total: number;
  estado: "balanceado" | "faltante" | "sobrante";
  totalEntradas: number;
  totalSalidas: number;
};

type PDFReportProps = {
  entradas: Movimiento[];
  salidas: Movimiento[];
  detalleEfectivo: Record<string, number>;
  fecha: string;
  turno: string;
  estadoCaja: EstadoCaja;
  ventaMañana: number;
  ventaTarde: number;
  ventaTotal: number;
  ventaMañanaCaja: number;
  ventaTardeCaja: number;
  ventaTotalCaja: number;
};

const PDFReport = ({
  entradas,
  salidas,
  detalleEfectivo,
  fecha,
  turno,
  estadoCaja,
  ventaMañana,
  ventaTarde,
  ventaTotal,
  ventaMañanaCaja,
  ventaTardeCaja,
  ventaTotalCaja,
}: PDFReportProps) => {
  const totalEfectivo = Object.entries(detalleEfectivo).reduce(
    (acc, [den, cant]) => acc + Number(den) * cant,
    0
  );

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Planilla de Caja</Text>
          <View>
            <Text style={styles.dateTurno}>{formatFecha(fecha)}</Text>
            <Text style={styles.dateTurno}>{turno}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.box}>
            <Text style={styles.subtitle}>Entradas</Text>
            {entradas.map((mov, index) => (
              <View key={`${mov.concepto}-${index}`} style={styles.item}>
                <Text>{mov.concepto}</Text>
                <Text>${mov.monto.toFixed(2)}</Text>
              </View>
            ))}
            <Text style={styles.totalText}>
              Subtotal: ${estadoCaja.totalEntradas}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.subtitle}>Salidas</Text>
            {salidas.map((mov, index) => (
              <View key={`${mov.concepto}-${index}`} style={styles.item}>
                <Text>{mov.concepto}</Text>
                <Text>${mov.monto.toFixed(2)}</Text>
              </View>
            ))}
            <Text style={styles.totalText}>
              Subtotal: ${estadoCaja.totalSalidas}
            </Text>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>
            Total: ${estadoCaja.total} ({estadoCaja.estado})
          </Text>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        {Object.keys(detalleEfectivo).length > 0 && (
          <View style={styles.efectivoBox}>
            <Text style={styles.subtitle}>Detalle de Efectivo</Text>
            {Object.entries(detalleEfectivo)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([den, cant]) => (
                <View key={den} style={styles.item}>
                  <Text style={styles.efectivoText}>
                    {cant} x ${Number(den).toLocaleString()}
                  </Text>
                  <Text style={styles.efectivoText}>
                    ${(Number(den) * cant).toLocaleString()}
                  </Text>
                </View>
              ))}
            <Text style={styles.totalText}>
              Total efectivo: ${totalEfectivo.toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.totalBox}>
          {turno !== "mañana" && (
            <>
              <Text style={styles.totalText}>
                Sistema Mañana = ${ventaMañana}
              </Text>
              <Text style={styles.totalText}>
                Sistema Tarde = ${ventaTarde}
              </Text>
              <Text style={styles.totalText}>
                Sistema Total = ${ventaTotal}
              </Text>
            </>
          )}
        </View>

        <View style={styles.totalBox}>
          {turno !== "tarde" && (
            <>
              <Text style={styles.totalText}>
                Caja Mañana = ${ventaMañanaCaja}
              </Text>
              <Text style={styles.totalText}>
                Caja Tarde = ${ventaTardeCaja}
              </Text>
              <Text style={styles.totalText}>
                Caja Total = ${ventaTotalCaja}
              </Text>
            </>
          )}
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalText} > Diferencia = {ventaTotal - ventaTotalCaja}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFReport;
