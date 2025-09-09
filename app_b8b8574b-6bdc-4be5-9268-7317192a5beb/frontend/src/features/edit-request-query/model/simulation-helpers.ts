import type {
  RestRequest,
  SqlQuery,
} from '@/entities/request-draft/model/types';

// Simulate REST request execution
export async function simulateRestExecution(request: RestRequest): Promise<{
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  data?: unknown;
  error?: { message: string; code?: string | number; details?: unknown };
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  // Simulate various response scenarios based on URL
  const url = request.url.toLowerCase();

  if (!request.url || !request.method) {
    return {
      error: {
        message: 'URL and method are required',
        code: 'VALIDATION_ERROR',
      },
    };
  }

  // Simulate errors for certain URLs
  if (url.includes('error') || url.includes('fail')) {
    return {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'content-type': 'application/json',
        'x-error': 'simulated-error',
      },
      error: {
        message: 'Simulated server error',
        code: 500,
        details: { timestamp: new Date().toISOString() },
      },
    };
  }

  // Simulate 404 for missing resources
  if (url.includes('notfound') || url.includes('missing')) {
    return {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'content-type': 'application/json',
      },
      error: {
        message: 'Resource not found',
        code: 404,
      },
    };
  }

  // Simulate different response types based on method
  let mockData;
  let status = 200;
  let statusText = 'OK';

  switch (request.method.toUpperCase()) {
    case 'GET':
      if (url.includes('users')) {
        mockData = {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          ],
          total: 2,
          page: 1,
        };
      } else if (url.includes('products')) {
        mockData = {
          products: [
            { id: 1, name: 'Widget A', price: 29.99, category: 'tools' },
            { id: 2, name: 'Widget B', price: 39.99, category: 'tools' },
            { id: 3, name: 'Gadget C', price: 49.99, category: 'electronics' },
          ],
          total: 3,
        };
      } else {
        mockData = {
          message: 'Success',
          timestamp: new Date().toISOString(),
          data: { result: 'GET request executed successfully' },
        };
      }
      break;

    case 'POST':
      status = 201;
      statusText = 'Created';
      mockData = {
        message: 'Resource created successfully',
        id: Math.floor(Math.random() * 1000) + 1,
        created: new Date().toISOString(),
        data: request.body ? JSON.parse(request.body) : null,
      };
      break;

    case 'PUT':
      mockData = {
        message: 'Resource updated successfully',
        id: Math.floor(Math.random() * 1000) + 1,
        updated: new Date().toISOString(),
        data: request.body ? JSON.parse(request.body) : null,
      };
      break;

    case 'DELETE':
      status = 204;
      statusText = 'No Content';
      mockData = null;
      break;

    default:
      mockData = {
        message: `${request.method} request executed`,
        timestamp: new Date().toISOString(),
      };
  }

  return {
    status,
    statusText,
    headers: {
      'content-type': 'application/json',
      'x-response-time': `${Math.floor(Math.random() * 100)}ms`,
      'x-request-id': crypto.randomUUID(),
    },
    data: mockData,
  };
}

// Simulate SQL query execution
export async function simulateSqlExecution(query: SqlQuery): Promise<{
  data?: unknown;
  rowCount?: number;
  executionTime?: number;
  error?: { message: string; code?: string | number; details?: unknown };
}> {
  // Simulate query processing delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 800));

  const sql = query.query.trim().toLowerCase();

  if (!sql) {
    return {
      error: {
        message: 'Query cannot be empty',
        code: 'EMPTY_QUERY',
      },
    };
  }

  // Simulate syntax errors
  if (sql.includes('syntax_error') || sql.includes('invalid')) {
    return {
      error: {
        message: 'Syntax error in SQL query',
        code: 'SQL_SYNTAX_ERROR',
        details: { line: 1, column: sql.indexOf('syntax_error') },
      },
    };
  }

  // Simulate different query types
  let mockData;
  let rowCount = 0;

  if (sql.startsWith('select')) {
    // Simulate SELECT results
    if (sql.includes('users')) {
      mockData = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          created_at: '2024-01-16T11:45:00Z',
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          created_at: '2024-01-17T09:20:00Z',
        },
      ];
      rowCount = mockData.length;
    } else if (sql.includes('products')) {
      mockData = [
        {
          id: 1,
          name: 'Widget A',
          price: 29.99,
          category: 'tools',
          stock: 150,
        },
        { id: 2, name: 'Widget B', price: 39.99, category: 'tools', stock: 89 },
        {
          id: 3,
          name: 'Gadget C',
          price: 49.99,
          category: 'electronics',
          stock: 45,
        },
      ];
      rowCount = mockData.length;
    } else if (sql.includes('count')) {
      mockData = [{ count: Math.floor(Math.random() * 1000) + 10 }];
      rowCount = 1;
    } else {
      mockData = [
        { id: 1, value: 'Sample data A', timestamp: new Date().toISOString() },
        { id: 2, value: 'Sample data B', timestamp: new Date().toISOString() },
      ];
      rowCount = mockData.length;
    }
  } else if (sql.startsWith('insert')) {
    // Simulate INSERT results
    rowCount = Math.floor(Math.random() * 5) + 1;
    mockData = {
      message: `Inserted ${rowCount} row(s)`,
      insertId: Math.floor(Math.random() * 1000) + 1,
    };
  } else if (sql.startsWith('update')) {
    // Simulate UPDATE results
    rowCount = Math.floor(Math.random() * 10) + 1;
    mockData = {
      message: `Updated ${rowCount} row(s)`,
      affectedRows: rowCount,
    };
  } else if (sql.startsWith('delete')) {
    // Simulate DELETE results
    rowCount = Math.floor(Math.random() * 5) + 1;
    mockData = {
      message: `Deleted ${rowCount} row(s)`,
      affectedRows: rowCount,
    };
  } else if (
    sql.startsWith('create') ||
    sql.startsWith('drop') ||
    sql.startsWith('alter')
  ) {
    // Simulate DDL operations
    mockData = {
      message: 'DDL operation completed successfully',
      operation: sql.split(' ')[0].toUpperCase(),
    };
    rowCount = 0;
  } else {
    // Generic query result
    mockData = {
      message: 'Query executed successfully',
      result: 'Generic result data',
    };
    rowCount = 1;
  }

  return {
    data: mockData,
    rowCount,
    executionTime: Math.floor(Math.random() * 200) + 50,
  };
}
