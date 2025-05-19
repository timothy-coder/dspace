import { queryDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await queryDatabase(`
      SELECT DATE_FORMAT(FECHA, '%d-%m-%Y') as fecha, CLASIFICADOI, SUM(IMPORTE) as total
      FROM tu_tabla
      GROUP BY fecha, CLASIFICADOI
      ORDER BY fecha DESC
    `);

    const data = result.reduce((acc, row) => {
      if (!acc[row.fecha]) acc[row.fecha] = [];
      acc[row.fecha].push({ clasificador: row.CLASIFICADOI, total: row.total });
      return acc;
    }, {});

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
