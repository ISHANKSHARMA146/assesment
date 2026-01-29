class HRMSException(Exception):
    pass


class EmployeeNotFoundError(HRMSException):
    pass


class DuplicateEmployeeError(HRMSException):
    pass


class DuplicateAttendanceError(HRMSException):
    pass


class InvalidDateError(HRMSException):
    pass
