angular.module('travellite_admin', ['ngRoute'])
	.config(adminRouter);

function adminRouter($routeProvider) {

	$routeProvider
		.when('/', { templateUrl: 'partials/users/profile.html', controller: 'userprofileCtrl' })
		.when('/pipe', { templateUrl: 'partials/pipe.html', controller: 'pipeCtrl' })
		.when('/error-message', { templateUrl: 'partials/error-message.html', controller: 'error_messageCtrl' })
		.when('/menus', { templateUrl: 'partials/master/menus.html', controller: 'menusCtrl' })
		.when('/child-menus', { templateUrl: 'partials/master/child-menus.html', controller: 'childmenusCtrl' })
		.when('/companies', { templateUrl: 'partials/company/companies.html', controller: 'companyCtrl' })
		.when('/branches', { templateUrl: 'partials/company/branches.html', controller: 'branchesCtrl' })
		.when('/departments', { templateUrl: 'partials/company/departments.html', controller: 'DepartmentCtrl' })
		.when('/userprofile', { templateUrl: 'partials/users/profile.html', controller: 'userprofileCtrl' })
		.when('/positions', { templateUrl: 'partials/users/positions.html', controller: 'positionsCtrl' })
		.when('/usermanagement', { templateUrl: 'partials/users/usermanagement.html', controller: 'usermanagementCtrl' })
		.when('/printid', { templateUrl: 'partials/users/printid.html', controller: 'printidCtrl' })
		.when('/roles', { templateUrl: 'partials/users/roles.html', controller: 'rolesCtrl' })
		.when('/categories', { templateUrl: 'partials/items/categories.html', controller: 'categoriesCtrl' })
		.when('/items', { templateUrl: 'partials/items/items.html', controller: 'itemsCtrl' })
		.when('/approvals', { templateUrl: 'partials/items/approvals.html', controller: 'approvalsCtrl' })
		.when('/requisitionna', { templateUrl: 'partials/items/requisition_na.html', controller: 'requisitionNACtrl' })
		.when('/requisition', { templateUrl: 'partials/items/requisition.html', controller: 'requisitionCtrl' })
		.when('/workflow', { templateUrl: 'partials/admin/workflow.html', controller: 'workflowCtrl' })
		.when('/issuena', { templateUrl: 'partials/fulfilment/issuena.html', controller: 'issuenaCtrl' })
		.when('/issue', { templateUrl: 'partials/fulfilment/issue.html', controller: 'issueCtrl' })
		.when('/printtag', { templateUrl: 'partials/items/printtag.html', controller: 'printtagCtrl' })
		.when('/idcards', { templateUrl: 'partials/items/idcards.html', controller: 'idcardsCtrl' })
		.when('/additems', { templateUrl: 'partials/items/stock.html', controller: 'stockCtrl' })
		.when('/assign', { templateUrl: 'partials/items/assign.html', controller: 'assignCtrl' })
        .when('/attendance', { templateUrl: 'partials/attendance/attendance.html', controller: 'attendanceCtrl' })
        .when('/searchId', { templateUrl: 'partials/items/SearchId.html', controller: 'SearchIdCtrl' })
		.when('/testdash', { templateUrl: 'partials/attendance/dash.html', controller: 'testdashCtrl' })
		.when('/dashboard', { templateUrl: 'partials/attendance/dashboard.html', controller: 'dashboardCtrl' });

		
		//rptcollections
}