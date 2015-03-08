'use strict';

angular.module('datatables.instances', [])
    .factory('DTInstances', dtInstances)
    .factory('DTInstanceFactory', dtInstanceFactory);

/* @ngInject */
function dtInstances($q) {
    var _listIstances = {};
    var _lastInstance = null;
    // Promise for fetching the last DT instance
    var _deferLastDTInstance = $q.defer();
    var _lastDTInstancePromise = _deferLastDTInstance.promise;
    // Promise for fetching the list of DT instances
    var _deferListDTInstances = $q.defer();
    var _listDTInstancesPromise = _deferListDTInstances.promise;

    return {
        register: register,
        getLast: getLast,
        getList: getList
    };

    function register(dtInstance, result) {
        dtInstance.id = result.id;
        dtInstance.DataTable = result.DataTable;
        dtInstance.dataTable = result.dataTable;

        _lastInstance = dtInstance;
        _listIstances[dtInstance.id] = dtInstance;

        if (_deferLastDTInstance) {
            _deferLastDTInstance.resolve(dtInstance);
        }
        if (_deferListDTInstances) {
            _deferListDTInstances.resolve(_listIstances);
        }

        return dtInstance;
    }

    function getLast() {
        var defer = $q.defer();
        _lastDTInstancePromise.then(function(lastInstance) {
            defer.resolve(lastInstance);
        });
        return defer.promise;
    }

    function getList() {
        var defer = $q.defer();
        _listDTInstancesPromise.then(function(listInstances) {
            defer.resolve(listInstances);
        });
        return defer.promise;
    }
}
dtInstances.$inject = ['$q'];

function dtInstanceFactory() {
    var DTInstance = {
        reloadData: reloadData,
        changeData: changeData,
        rerender: rerender
    };
    return {
        newDTInstance: newDTInstance
    };

    function newDTInstance(renderer) {
        var dtInstance = Object.create(DTInstance);
        dtInstance._renderer = renderer;
        return dtInstance;
    }

    function reloadData() {
        /*jshint validthis:true */
        this._renderer.reloadData();
    }

    function changeData(data) {
        /*jshint validthis:true */
        this._renderer.changeData(data);
    }

    function rerender() {
        /*jshint validthis:true */
        this._renderer.rerender();
    }
}
