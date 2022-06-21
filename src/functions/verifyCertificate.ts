import { APIGatewayProxyHandler } from "aws-lambda";
import { SortingConfiguration } from "aws-sdk/clients/kendra";
import { document } from "../utils/dynamodbClient";

interface IUserCertificate {
  name: string;
  id: SortingConfiguration;
  created_at: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_certificate",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();
  const certificate = response.Items[0] as IUserCertificate;
  if (certificate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Valid certificate",
        name: certificate.name,
        url: `https://certificates-ignite.s3.amazonaws.com/${id}.pdf`,
      }),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Invalid certificate",
    }),
  };
};
