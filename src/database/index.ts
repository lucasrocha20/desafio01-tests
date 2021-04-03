import { Connection, createConnection, getConnectionOptions } from "typeorm";

interface IOptions {
  host: string;
  database: string;
}

getConnectionOptions().then((options) => {
  const newOptions = options as IOptions;
  newOptions.host = process.env.NODE_ENV === "test" ? "localhost" : "database";
  (newOptions.database = "fin_api"),
    createConnection({
      ...options,
    });
});

export default async (): Promise<Connection> => {
  return createConnection();
};
