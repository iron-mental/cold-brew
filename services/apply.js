const { format } = require('date-fns')

const applyDao = require('../dao/apply')

const createApply = async ({ study_id }, createData) => {
  createData.study_id = study_id
  const newApply = await applyDao.createApply(createData)
  if (newApply.affectedRows === 0) {
    throw { status: 400, message: '스터디 신청에 실패했습니다' }
  }
}

const applyDetail = async ({ study_id, apply_id }) => {
  const applyData = await applyDao.applyDetail(study_id, apply_id)
  if (applyData.length === 0) {
    throw { status: 400, message: '조회 결과가 없습니다' }
  }

  applyData[0].create_at = format(applyData[0].create_at, 'yyyy-MM-dd HH:mm:ss')
  // 정책 마련 후 rejectedAt도 수정
  return applyData
}

const applyUpdate = async ({ study_id, apply_id }, updateData) => {
  const rows = await applyDao.applyUpdate(study_id, apply_id, updateData)
  if (rows.affectedRows === 0) {
    throw { status: 400, message: '수정에 실패했습니다' }
  }
}

const applyDelete = async ({ study_id, apply_id }) => {
  const rows = await applyDao.applyDelete(study_id, apply_id)
  if (rows.length === 0) {
    throw { status: 400, message: '삭제에 실패했습니다' }
  }
}

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
}
