const tableController = require('../../controllers/tableController');
const Table = require('../../models/Table');

jest.mock('../../models/Table');

describe('Table Controller', () => {
  describe('getAllTables', () => {
    it('should return paginated tables with metadata', async () => {
      const req = {
        query: {
          page: '1',
          limit: '10',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      const mockTables = [{ _id: '1', name: 'Table 1' }];
      
      // Create a mock query object with chainable methods
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTables),
      };
      
      Table.find.mockReturnValue(mockQuery);
      Table.countDocuments.mockResolvedValue(1);

      await tableController.getAllTables(req, res, next);

      expect(Table.find).toHaveBeenCalled();
      expect(Table.countDocuments).toHaveBeenCalled();
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Tables retrieved successfully',
          data: mockTables,
          meta: expect.objectContaining({
            page: 1,
            limit: 10,
            total: 1,
            pages: 1,
          }),
        })
      );
    });
  });

  describe('getTableById', () => {
    it('should return table when given valid ID', async () => {
      const req = {
        params: {
          tableId: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId format
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      const mockTable = { 
        _id: '507f1f77bcf86cd799439011', 
        name: 'Table 1' 
      };
      
      Table.findById.mockResolvedValue(mockTable);

      await tableController.getTableById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Table retrieved successfully',
          data: mockTable,
        })
      );
    });

    it('should return 400 if ID format is invalid', async () => {
      const req = {
        params: {
          tableId: 'invalid-id',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      await tableController.getTableById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid table ID format',
        })
      );
    });

    it('should return 404 if table not found', async () => {
      const req = {
        params: {
          tableId: '507f1f77bcf86cd799439011',
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      Table.findById.mockResolvedValue(null);

      await tableController.getTableById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Table not found',
        })
      );
    });
  });
});