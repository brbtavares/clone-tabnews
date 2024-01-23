import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;
  const databaseResultVersionMaxConnections = await database.query(
    "SHOW server_version; SHOW max_connections;"
  );
  const databaseResultOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const [databaseVersion, databaseMaxConnections] =
    databaseResultVersionMaxConnections.map((r) => r.rows[0]);
  const databaseOpenedConnections = databaseResultOpenedConnections.rows[0];

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: parseInt(databaseMaxConnections.max_connections),
        opened_connections: databaseOpenedConnections.count,
        version: databaseVersion.server_version,
      },
    },
  });
}

export default status;
